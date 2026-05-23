import mongoose from 'mongoose';

const scrumCallSchema = new mongoose.Schema(
  {
    batch: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
    date: { type: Date, required: true },
    agenda: { type: String, required: true },
    conductedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['In Progress', 'Completed'], default: 'Completed' },
    startTime: { type: String },
  },
  { timestamps: true }
);

// Only one scrum call per batch per day
scrumCallSchema.index({ batch: 1, date: 1 }, { unique: true });

export default mongoose.model('ScrumCall', scrumCallSchema);
