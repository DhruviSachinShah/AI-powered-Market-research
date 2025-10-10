import mongoose, { Document, Schema } from 'mongoose';

export interface IQuestion {
  id: string;
  text: string;
  order: number;
  expectedThemes: string[];
  expectedSentiment: string;
  probingStrategy: 'depth' | 'clarification' | 'example' | 'comparison';
}

export interface IInterviewTemplate extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  targetAudience: string;
  questions: IQuestion[];
  systemPrompt: string;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema<IQuestion>({
  id: { type: String, required: true },
  text: { type: String, required: true },
  order: { type: Number, required: true },
  expectedThemes: [{ type: String }],
  expectedSentiment: { type: String, required: true },
  probingStrategy: { 
    type: String, 
    enum: ['depth', 'clarification', 'example', 'comparison'], 
    required: true 
  }
});

const InterviewTemplateSchema = new Schema<IInterviewTemplate>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  targetAudience: { type: String, required: true },
  questions: [QuestionSchema],
  systemPrompt: { type: String, required: true }
}, {
  timestamps: true
});

export const InterviewTemplate = mongoose.model<IInterviewTemplate>('InterviewTemplate', InterviewTemplateSchema);
