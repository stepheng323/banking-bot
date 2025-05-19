import { Injectable } from '@nestjs/common';
import {db} from '../kysely.service'

@Injectable()
export class UserRepo {
  async findUserByPhoneNumber(phoneNumber: string) {
        const user = await db
            .selectFrom('User')
            .selectAll()
            .where('phone', '=', phoneNumber)
            .executeTakeFirst();
        return user;
    }

    async createUser(phoneNumber: string) {
        const user = await db
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