import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from './schemas/project.schema';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';

@Injectable()
export class ProjectsService {
  constructor(@InjectModel(Project.name) private projectModel: Model<ProjectDocument>) {}

  async findAll(userId: string): Promise<ProjectDocument[]> {
    return this.projectModel.find({ userId }).sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string, userId: string): Promise<ProjectDocument | null> {
    return this.projectModel.findOne({ _id: id, userId }).exec();
  }

  async create(userId: string, createProjectDto: CreateProjectDto): Promise<ProjectDocument> {
    const project = new this.projectModel({
      ...createProjectDto,
      userId,
    });
    return project.save();
  }

  async update(id: string, userId: string, updateProjectDto: UpdateProjectDto): Promise<ProjectDocument | null> {
    return this.projectModel
      .findOneAndUpdate({ _id: id, userId }, updateProjectDto, { new: true })
      .exec();
  }

  async remove(id: string, userId: string): Promise<void> {
    await this.projectModel.findOneAndDelete({ _id: id, userId }).exec();
  }
}
