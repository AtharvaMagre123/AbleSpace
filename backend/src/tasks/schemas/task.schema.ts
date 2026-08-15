import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TaskDocument = Task & Document;

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  ON_HOLD = 'ON_HOLD',
}

export enum TaskPriority {
  NONE = 'NONE',
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

@Schema({ timestamps: true })
export class TaskComment {
  @Prop({ default: () => new Types.ObjectId().toHexString() })
  _id: string;

  @Prop({ required: true })
  text: string;

  @Prop({ required: true })
  authorName: string;

  @Prop({ required: true })
  authorAvatar: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}
export const TaskCommentSchema = SchemaFactory.createForClass(TaskComment);

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true })
  title: string;

  @Prop({ required: false })
  description?: string;

  @Prop({ required: true, enum: TaskStatus, default: TaskStatus.TODO })
  status: TaskStatus;

  @Prop({ required: true, enum: TaskPriority, default: TaskPriority.NONE })
  priority: TaskPriority;

  @Prop({ required: false })
  startDate?: Date;

  @Prop({ required: false })
  dueDate?: Date;

  @Prop({ required: false })
  category?: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Task', required: false })
  parentId?: Types.ObjectId;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ required: false, default: 0 })
  order: number;

  @Prop({ type: [{ userId: String, username: String, avatar: String, fullName: String }], default: [] })
  members: { userId: string; username: string; avatar?: string; fullName?: string }[];

  @Prop({ type: [TaskCommentSchema], default: [] })
  comments: TaskComment[];
}

export const TaskSchema = SchemaFactory.createForClass(Task);
