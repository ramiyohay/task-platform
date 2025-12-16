import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async onModuleInit() {
    const count = await this.userRepo.count(); // check existing users

    if (count > 0) return; // no need to seed

    // Seed initial users
    await this.userRepo.save([
      { name: 'Dan' },
      { name: 'Moshe' },
      { name: 'Meital' },
    ]);
  }
}