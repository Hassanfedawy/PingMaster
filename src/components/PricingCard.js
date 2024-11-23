import { motion } from 'framer-motion';

const PricingCard = ({ title, price, features, isPopular }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`relative p-8 bg-white rounded-2xl shadow-xl ${
        isPopular ? 'border-2 border-indigo-600' : ''
      }`}
    >
      {isPopular && (
        <span className="absolute top-0 right-0 px-3 py-1 text-sm text-white bg-indigo-600 rounded-bl-lg rounded-tr-lg">
          Popular
        </span>
      )}
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        <div className="mt-4">
          <span className="text-4xl font-bold">${price}</span>
          <span className="text-gray-500">/month</span>
        </div>
        <ul className="mt-6 space-y-4">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center space-x-2">
              <svg
                className="w-5 h-5 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-gray-600">{feature}</span>
            </li>
          ))}
        </ul>
        <button
          className={`mt-8 w-full py-3 px-4 rounded-lg font-semibold ${
            isPopular
              ? 'bg-indigo-600 text-white hover:bg-indigo-700'
              : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
          }`}
        >
          Get Started
        </button>
      </div>
    </motion.div>
  );
};

export default PricingCard;
