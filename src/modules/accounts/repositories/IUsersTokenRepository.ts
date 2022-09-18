import { ICreateUserTokenDTO } from "../dtos/ICreateUserTokenDTO";
import { UserToken } from "../infra/typeorm/entities/UserToken";

interface IUserTokensRepository {
  create(params: ICreateUserTokenDTO): Promise<UserToken>;
}

export { IUserTokensRepository };
