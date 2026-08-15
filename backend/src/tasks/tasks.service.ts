import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from './schemas/task.schema';
import { CreateTaskDto, UpdateTaskDto, TaskFilterDto } from './dto/task.dto';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  async create(createTaskDto: CreateTaskDto, userId: string): Promise<TaskDocument> {
    const task = new this.taskModel({
      ...createTaskDto,
      userId,
    });
    return task.save();
  }

  async findAll(userId: string, filterDto?: TaskFilterDto): Promise<TaskDocument[]> {
    const query: any = {
      $or: [{ userId }, { 'members.userId': userId }],
    };

    if (filterDto) {
      if (filterDto.status) {
        query.status = filterDto.status;
      }
      if (filterDto.priority) {
        query.priority = filterDto.priority;
      }
      if (filterDto.category) {
        query.category = filterDto.category;
      }
      if (filterDto.search) {
        query.$and = [
          {
            $or: [
              { title: { $regex: filterDto.search, $options: 'i' } },
              { description: { $regex: filterDto.search, $options: 'i' } },
            ],
          },
        ];
      }
    }

    let sort: any = { order: 1, createdAt: -1 };
    if (filterDto?.sortBy) {
      sort = { [filterDto.sortBy]: filterDto.sortOrder === 'asc' ? 1 : -1 };
    }

    return this.taskModel.find(query).populate('userId', 'username avatar fullName email').sort(sort).exec();
  }

  async findOne(id: string, userId: string): Promise<TaskDocument> {
    const task = await this.taskModel.findById(id).populate('userId', 'username avatar fullName email').exec();
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    const taskOwnerId = (task.userId as any)?._id?.toString() || task.userId.toString();
    const isOwner = taskOwnerId === userId;
    const isMember = task.members?.some((m: any) => m.userId === userId);

    if (!isOwner && !isMember) {
      throw new ForbiddenException('You do not have access to this task');
    }
    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, userId: string): Promise<TaskDocument> {
    const task = await this.findOne(id, userId);
    const taskOwnerId = (task.userId as any)?._id?.toString() || task.userId.toString();
    const isOwner = taskOwnerId === userId;
    
    if (!isOwner) {
      const allowedKeys = ['status', 'comments'];
      const updateKeys = Object.keys(updateTaskDto);
      const isOnlyAllowedKeys = updateKeys.every(key => allowedKeys.includes(key));
      
      if (!isOnlyAllowedKeys) {
        throw new ForbiddenException('Members can only update task status and comments');
      }
    }
    
    Object.assign(task, updateTaskDto);
    return task.save();
  }

  async remove(id: string, userId: string): Promise<void> {
    const task = await this.findOne(id, userId);
    const taskOwnerId = (task.userId as any)?._id?.toString() || task.userId.toString();
    if (taskOwnerId !== userId) {
      throw new ForbiddenException('Only the owner can delete this task');
    }
    await this.taskModel.findByIdAndDelete(id).exec();
  }

  async getTaskStats(userId: string) {
    const tasks = await this.taskModel.find({ userId }).exec();

    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'COMPLETED').length;
    const inProgress = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
    const todo = tasks.filter((t) => t.status === 'TODO').length;

    return {
      total,
      completed,
      inProgress,
      todo,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }
}
