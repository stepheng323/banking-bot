import { Injectable } from '@nestjs/common';
import { KyselyService } from '../kysely.service';

@Injectable()
export class UserRepo {
  constructor(private readonly kyselyService: KyselyService) {}

  async findUserByPhoneNumber(phoneNumber: string) {
    const user = await this.kyselyService
      .getDb()
      .selectFrom('User')
      .selectAll()
      .where('phone', '=', phoneNumber)
      .executeTakeFirst();
    return user;
  }

  async createUser(phoneNumber: string) {
    const user = await this.kyselyService
      .getDb()
      .insertInto('User')
      .values({
        id: '',
        phone: phoneNumber,
        firstname: '',
        lastname: '',
      })
      .returningAll()
      .executeTakeFirst();
    return user;
  }
}
