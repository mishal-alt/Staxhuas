import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Invitation from './src/models/Invitation.js';
import User from './src/models/User.js';
import Batch from './src/models/Batch.js';
import crypto from 'crypto';

dotenv.config();

const seedInvitations = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined in .env');
    }

    await mongoose.connect(mongoUri);
    console.log('MongoDB connected for seeding invitations...');

    // Find the facilitator or admin to assign as the inviter
    const admin = await User.findOne({ role: 'admin' });
    const facilitator = await User.findOne({ role: 'facilitator' });
    const inviter = facilitator || admin;
    if (!inviter) {
      throw new Error('No admin or facilitator found in database to act as inviter. Run seed.js first.');
    }

    // Find active batch
    const batch = await Batch.findOne({});
    if (!batch) {
      throw new Error('No batch found in database. Run seed.js first.');
    }

    // Clear existing invitations
    await Invitation.deleteMany({});
    console.log('Cleared existing invitations.');

    // Generate diverse test invitations
    const invites = [
      {
        name: 'Aarav Sharma',
        email: 'aarav.sharma@example.com',
        role: 'student',
        invitedBy: inviter._id,
        batch: batch._id,
        token: crypto.randomBytes(32).toString('hex'),
        status: 'pending',
        expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // Expires in 5 days
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // Sent 2 hours ago
      },
      {
        name: 'Ishaan Patel',
        email: 'ishaan.patel@example.com',
        role: 'student',
        invitedBy: inviter._id,
        batch: batch._id,
        token: crypto.randomBytes(32).toString('hex'),
        status: 'accepted',
        expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        acceptedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // Sent 3 days ago, accepted 1 day ago
      },
      {
        name: 'Meera Nair',
        email: 'meera.nair@example.com',
        role: 'student',
        invitedBy: inviter._id,
        batch: batch._id,
        token: crypto.randomBytes(32).toString('hex'),
        status: 'pending',
        expiresAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Expired 1 day ago
        createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000) // Sent 8 days ago
      },
      {
        name: 'Kabir Mehta',
        email: 'kabir.mehta@example.com',
        role: 'student',
        invitedBy: inviter._id,
        batch: batch._id,
        token: crypto.randomBytes(32).toString('hex'),
        status: 'revoked',
        expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) // Sent 4 days ago, revoked
      },
      {
        name: 'Ananya Rao',
        email: 'ananya.rao@example.com',
        role: 'student',
        invitedBy: inviter._id,
        batch: batch._id,
        token: crypto.randomBytes(32).toString('hex'),
        status: 'pending',
        expiresAt: new Date(Date.now() + 20 * 60 * 60 * 1000), // Expires in 20 hours
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000) // Sent 6 days ago (old pending warning flag)
      },
      {
        name: 'Rohan Deshmukh',
        email: 'rohan.d@example.com',
        role: 'student',
        invitedBy: inviter._id,
        batch: batch._id,
        token: crypto.randomBytes(32).toString('hex'),
        status: 'accepted',
        expiresAt: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
        acceptedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        name: 'Sanya Gupta',
        email: 'sanya.g@example.com',
        role: 'student',
        invitedBy: inviter._id,
        batch: batch._id,
        token: crypto.randomBytes(32).toString('hex'),
        status: 'pending',
        expiresAt: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
        createdAt: new Date() // Sent just now
      },
      {
        name: 'Vikram Singh',
        email: 'vikram.s@example.com',
        role: 'student',
        invitedBy: inviter._id,
        batch: batch._id,
        token: crypto.randomBytes(32).toString('hex'),
        status: 'pending',
        expiresAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // Expired 3 days ago
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
      }
    ];

    await Invitation.insertMany(invites);
    console.log(`Seeded ${invites.length} demo invitations successfully.`);

    mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Seeding invitations failed:', error);
    process.exit(1);
  }
};

seedInvitations();
