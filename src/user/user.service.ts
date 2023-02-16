import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entity/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  get(): Promise<User[]> {
    return this.userRepository.find();
  }

  async create(userDetails: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(userDetails.password, 10); // Hash the user's password using bcrypt
    const newUser = this.userRepository.create({
      ...userDetails,
      password: hashedPassword,
      createdAt: new Date(),
    });
    return this.userRepository.save(newUser);
  }

  async update(userId: number, updateParams: UpdateUserDto) {
    console.log(userId)
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      return null;
    }
    if (updateParams.name) {
      user.name = updateParams.name;
    }

    if (updateParams.password) {
      const salt = await bcrypt.genSalt();
      user.password = await bcrypt.hash(updateParams.password, salt);
    }

    const updatedUser = await this.userRepository.save(user);

    return updatedUser;
  }

  show(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  async delete(id: number) {
    const user = await this.userRepository.findOne({ where: { id: id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    await this.userRepository.delete(id);
  }
}
