import mongoose from 'mongoose';

const monitorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please provide a name for the monitor'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  url: {
    type: String,
    required: [true, 'Please provide a URL to monitor'],
    trim: true,
    match: [
      /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
      'Please provide a valid URL'
    ]
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'error'],
    default: 'active'
  },
  interval: {
    type: Number,
    default: 5,
    min: [1, 'Monitoring interval cannot be less than 1 minute'],
    max: [60, 'Monitoring interval cannot be more than 60 minutes']
  },
  lastChecked: {
    type: Date
  },
  lastStatus: {
    type: String,
    enum: ['up', 'down', null],
    default: null
  },
  uptime: {
    type: Number,
    default: 100
  },
  responseTime: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  notifications: {
    email: {
      type: Boolean,
      default: true
    },
    threshold: {
      type: Number,
      default: 1000,
      min: [100, 'Threshold cannot be less than 100ms'],
      max: [10000, 'Threshold cannot be more than 10000ms']
    }
  }
});

// Indexes for better query performance
monitorSchema.index({ userId: 1, status: 1 });
monitorSchema.index({ url: 1 });

const Monitor = mongoose.models.Monitor || mongoose.model('Monitor', monitorSchema);

export default Monitor;
