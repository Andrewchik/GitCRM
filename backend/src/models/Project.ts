import { Schema, model, Types, Document } from 'mongoose';

export interface IProject extends Document {
  userId: Types.ObjectId;
  repoFullName: string; 
  owner: string;
  name: string;
  url: string;
  stars: number;
  forks: number;
  openIssues: number;
  repoCreatedAtUnix: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    repoFullName: { type: String, required: true },
    owner: { type: String, required: true },
    name: { type: String, required: true },
    url: { type: String, required: true },
    stars: { type: Number, required: true },
    forks: { type: Number, required: true },
    openIssues: { type: Number, required: true },
    repoCreatedAtUnix: { type: Number, required: true },
  },
  { timestamps: true }
);

// унікальний репозиторій на користувача
ProjectSchema.index({ userId: 1, repoFullName: 1 }, { unique: true });

export default model<IProject>('Project', ProjectSchema);
