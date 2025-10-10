import mongoose, { Document, Schema } from 'mongoose';

export interface IResponse {
  questionId: string;
  questionText: string;
  questionType: 'initial' | 'follow-up';
  userAnswer: string;
  aiProbe?: string;
  scores: {
    relevance: number;
    depth: number;
    consistency: number;
    sentimentAlignment: number;
    composite: number;
  };
  vectorEmbedding: number[];
  timestamp: Date;
}

export interface IInterviewInsights {
  keyThemes: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  completionRate: number;
}

export interface IInterviewMetadata {
  duration: number; // seconds
  questionCount: number;
  followUpCount: number;
}

export interface IInterview extends Document {
  _id: mongoose.Types.ObjectId;
  respondentName: string;
  respondentEmail: string;
  templateId: mongoose.Types.ObjectId;
  status: 'in-progress' | 'completed' | 'abandoned';
  startedAt: Date;
  completedAt?: Date;
  responses: IResponse[];
  overallScore: number;
  insights: IInterviewInsights;
  metadata: IInterviewMetadata;
  createdAt: Date;
  updatedAt: Date;
}

const ResponseSchema = new Schema<IResponse>({
  questionId: { type: String, required: true },
  questionText: { type: String, required: true },
  questionType: { type: String, enum: ['initial', 'follow-up'], required: true },
  userAnswer: { type: String, required: true },
  aiProbe: { type: String },
  scores: {
    relevance: { type: Number, required: true },
    depth: { type: Number, required: true },
    consistency: { type: Number, required: true },
    sentimentAlignment: { type: Number, required: true },
    composite: { type: Number, required: true }
  },
  vectorEmbedding: [{ type: Number }],
  timestamp: { type: Date, default: Date.now }
});

const InterviewInsightsSchema = new Schema<IInterviewInsights>({
  keyThemes: [{ type: String }],
  sentiment: { type: String, enum: ['positive', 'neutral', 'negative'], required: true },
  completionRate: { type: Number, required: true }
});

const InterviewMetadataSchema = new Schema<IInterviewMetadata>({
  duration: { type: Number, required: true },
  questionCount: { type: Number, required: true },
  followUpCount: { type: Number, required: true }
});

const InterviewSchema = new Schema<IInterview>({
  respondentName: { type: String, required: true },
  respondentEmail: { type: String, required: true },
  templateId: { type: Schema.Types.ObjectId, ref: 'InterviewTemplate', required: true },
  status: { type: String, enum: ['in-progress', 'completed', 'abandoned'], required: true },
  startedAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
  responses: [ResponseSchema],
  overallScore: { type: Number, default: 0 },
  insights: InterviewInsightsSchema,
  metadata: InterviewMetadataSchema
}, {
  timestamps: true
});

// Indexes
InterviewSchema.index({ respondentEmail: 1 });
InterviewSchema.index({ status: 1 });
InterviewSchema.index({ createdAt: -1 });

export const Interview = mongoose.model<IInterview>('Interview', InterviewSchema);
