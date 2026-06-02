import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';
import Course from './src/models/Course.js';
import Batch from './src/models/Batch.js';
import Interview from './src/models/Interview.js';
import { ROLES } from './src/utils/constants.js';

dotenv.config();

const seedInterviews = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined in .env');
    }

    await mongoose.connect(mongoUri);
    console.log('MongoDB connected for seeding interviews...');

    // 1. Find the interviewer
    const interviewer = await User.findOne({ email: 'interviewer@staxhaus.com' });
    if (!interviewer) {
      throw new Error('Interviewer not found. Run seed.js first.');
    }

    // 2. Find the facilitator
    const facilitator = await User.findOne({ email: 'facilitator@staxhaus.com' });
    if (!facilitator) {
      throw new Error('Facilitator not found. Run seed.js first.');
    }

    // 3. Find the batch
    const batch = await Batch.findOne({ name: 'FSD-COHORT-2026' });
    if (!batch) {
      throw new Error('Batch FSD-COHORT-2026 not found. Run seed.js first.');
    }

    // 4. Find or create the course by name
    let course = await Course.findOne({ name: 'Full Stack Development' });
    if (!course) {
      course = new Course({
        name: 'Full Stack Development',
        description: 'Master the MERN stack and professional web development.',
        durationMonths: 6,
      });
      await course.save();
      console.log('Created Course document in DB.');
    }

    // 5. Update batch course pointer
    batch.course = course._id;
    await batch.save();
    console.log(`Associated Batch ${batch.name} with Course ${course.name}`);

    // 6. Find the students in this batch
    const students = await User.find({ batch: batch._id, role: ROLES.STUDENT });
    if (students.length === 0) {
      throw new Error('No students found in the batch. Run seed.js first.');
    }

    // 7. Clean up old interviews for these students or this interviewer
    await Interview.deleteMany({ interviewer: interviewer._id });
    console.log('Old interviews cleared.');

    // 8. Create demo interviews
    const today = new Date();
    
    const demoInterviews = [
      {
        student: students[0]._id, // Ahmed Khan
        batch: batch._id,
        course: course._id,
        module: 'React Basics & State',
        interviewer: interviewer._id,
        facilitator: facilitator._id,
        scheduledDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 30),
        scheduledTime: '10:30 AM',
        mode: 'online',
        status: 'in_progress',
        createdBy: facilitator._id,
        meetingLink: 'https://meet.google.com/abc-defg-hij',
        attemptNumber: 1
      },
      {
        student: students[1]._id, // Sara Ali
        batch: batch._id,
        course: course._id,
        module: 'Advanced JavaScript (ES6+)',
        interviewer: interviewer._id,
        facilitator: facilitator._id,
        scheduledDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 14, 0),
        scheduledTime: '02:00 PM',
        mode: 'offline',
        status: 'scheduled',
        createdBy: facilitator._id,
        attemptNumber: 1
      },
      {
        student: students[2]._id, // Zaid Mirza
        batch: batch._id,
        course: course._id,
        module: 'HTML & CSS Layouts',
        interviewer: interviewer._id,
        facilitator: facilitator._id,
        scheduledDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 11, 0),
        scheduledTime: '11:00 AM',
        mode: 'online',
        status: 'scheduled',
        createdBy: facilitator._id,
        meetingLink: 'https://meet.google.com/xyz-qprs-tuv',
        attemptNumber: 2
      }
    ];

    for (const data of demoInterviews) {
      const interview = new Interview(data);
      await interview.save();
      console.log(`Seeded interview for student ${data.student} on ${data.module}`);
    }

    console.log('Seeding completed successfully!');
    mongoose.connection.close();
    process.exit(0);

  } catch (error) {
    console.error('Seeding interviews failed:', error);
    process.exit(1);
  }
};

seedInterviews();
