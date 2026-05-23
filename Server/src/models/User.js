import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { ROLES, STUDENT_STATUS } from '../utils/constants.js';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: Object.values(ROLES),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(STUDENT_STATUS),
      default: STUDENT_STATUS.ACTIVE,
    },
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Batch',
      default: null,
    },
    profilePic: { type: String, default: null },
    phone: { type: String, trim: true, default: '' },
    location: { type: String, trim: true, default: '' },
    headline: { type: String, trim: true, default: '' },
    address: { type: String, trim: true, default: '' },
    emergencyContact: { type: String, trim: true, default: '' },
    attendancePercentage: { type: Number, default: 0 },
    leavesTaken: { type: Number, default: 0 },
    currentModule: {
      name: { type: String, default: 'Module 1' }
    },
    // Track refresh token for logout
    refreshToken: { type: String, select: false },
    googleRefreshToken: { type: String, select: false },
    googleConnected: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);
