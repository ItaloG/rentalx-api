import { ICreateUserTokenDTO } from "@modules/accounts/dtos/ICreateUserTokenDTO";
import { IUserTokensRepository } from "@modules/accounts/repositories/IUsersTokenRepository";
import { dataSource } from "@shared/infra/typeorm";
import { Repository } from "typeorm";
import { UserToken } from "../entities/UserToken";

class UsersTokenRepository implements IUserTokensRepository {
  private repository: Repository<UserToken>;

  constructor() {
    this.repository = dataSource.getRepository(UserToken);
  }

  async create({
    expires_date,
    refresh_token,
    user_id,
  }: ICreateUserTokenDTO): Promise<UserToken> {
    const userToken = this.repository.create({
      expires_date,
      refresh_token,
      user_id,
    });

    await this.repository.save(userToken);

    return userToken;
  }

  async findByUserIdAndRefreshToken(
    user_id: string,
    refresh_token: string
  ): Promise<UserToken> {
    return await this.repository.findOne({
      where: {
        user_id,
        refresh_token,
      },
    });
  }

  async deleteById(id: string): Promise<void> {
    await this.repository.delete({
      id,
    });
  }

  async findByRefreshToken(refresh_token: string): Promise<UserToken> {
    return await this.repository.findOne({
      where: {
        refresh_token,
      },
    });
  }
}

export { UsersTokenRepository };
