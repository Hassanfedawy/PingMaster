import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import connectDB from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

const authHandler = async (req) => {
  return await NextAuth(req, {
    providers: [
      CredentialsProvider({
        name: 'Credentials',
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" }
        },
        async authorize(credentials) {
          console.log('Starting authentication process...');
          
          try {
            // Set a timeout for the entire auth process
            const authPromise = new Promise(async (resolve, reject) => {
              try {
                await connectDB();
                console.log('Connected to MongoDB');
                
                const user = await User.findOne({ email: credentials.email }).select('+password');
                
                if (!user) {
                  console.log('User not found');
                  reject(new Error('Invalid credentials'));
                  return;
                }

                const isPasswordMatch = await bcrypt.compare(credentials.password, user.password);

                if (!isPasswordMatch) {
                  console.log('Password does not match');
                  reject(new Error('Invalid credentials'));
                  return;
                }

                console.log('Authentication successful');
                resolve({
                  id: user._id.toString(),
                  name: user.name,
                  email: user.email,
                  plan: user.plan,
                });
              } catch (error) {
                console.error('Auth process error:', error);
                reject(error);
              }
            });

            // Set a 30-second timeout
            const timeoutPromise = new Promise((_, reject) => {
              setTimeout(() => {
                reject(new Error('Authentication timed out'));
              }, 30000);
            });

            // Race between auth process and timeout
            const result = await Promise.race([authPromise, timeoutPromise]);
            return result;
          } catch (error) {
            console.error('Final auth error:', error);
            throw new Error(error.message || 'Authentication failed');
          }
        }
      })
    ],
    session: {
      strategy: "jwt",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          token.id = user.id;
          token.plan = user.plan;
        }
        return token;
      },
      async session({ session, token }) {
        if (token) {
          session.user.id = token.id;
          session.user.plan = token.plan;
        }
        return session;
      }
    },
    pages: {
      signIn: '/login',
      error: '/login',
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === 'development',
  });
};

export const GET = authHandler;
export const POST = authHandler;
