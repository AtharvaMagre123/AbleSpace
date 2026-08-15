import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  async findByUsername(username: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ username }).exec();
  }

  async findByGoogleId(googleId: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ googleId }).exec();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async searchByUsername(query: string): Promise<Partial<User>[]> {
    if (!query) return [];
    const users = await this.userModel
      .find({ username: { $regex: query, $options: 'i' } })
      .limit(10)
      .select('_id username avatar fullName')
      .exec();
    
    return users.map(u => ({
      id: u._id.toString(),
      username: u.username,
      avatar: u.avatar,
      fullName: u.fullName
    }));
  }

  async create(userData: Partial<User>): Promise<UserDocument> {
    const user = new this.userModel(userData);
    return user.save();
  }

  async updateTheme(userId: string, theme: string): Promise<UserDocument | null> {
    return this.userModel
      .findByIdAndUpdate(userId, { theme }, { new: true })
      .exec();
  }

  async updateColorMode(userId: string, colorMode: string): Promise<UserDocument | null> {
    return this.userModel
      .findByIdAndUpdate(userId, { colorMode }, { new: true })
      .exec();
  }

  async updateProfile(userId: string, profileData: Partial<{ fullName: string; title: string; username: string; email: string }>): Promise<UserDocument | null> {
    return this.userModel
      .findByIdAndUpdate(userId, profileData, { new: true })
      .exec();
  }

  async deleteUser(userId: string): Promise<void> {
    await this.userModel.findByIdAndDelete(userId).exec();
  }
}
