import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Interview from './src/models/Interview.js';

dotenv.config();

const listInterviews = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const list = await Interview.find({});
    console.log('--- Database Interviews ---');
    console.log(list.map(i => ({
      id: i._id,
      student: i.student,
      interviewer: i.interviewer,
      batch: i.batch,
      module: i.module,
      status: i.status
    })));
    mongoose.connection.close();
  } catch (e) {
    console.error(e);
  }
};

listInterviews();
