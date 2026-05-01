import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { JobStatus } from '../enums/job-status.enum';

export type JobDocument = Job & Document;

@Schema({ timestamps: true })
export class Job {
  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  company!: string;

  @Prop()
  description?: string;

  @Prop()
  location?: string;

  @Prop({
    type: String,
    enum: JobStatus,
    default: JobStatus.APPLIED,
  })
  status!: JobStatus;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId!: Types.ObjectId; // Reference to the User who created the job
}
export const JobSchema = SchemaFactory.createForClass(Job);

JobSchema.index({ userId: 1, createdAt: 1 }); // pagination + sorting
JobSchema.index({ status: 1 }); // filtering by status
JobSchema.index({ title: 'text', company: 'text' }); // search
