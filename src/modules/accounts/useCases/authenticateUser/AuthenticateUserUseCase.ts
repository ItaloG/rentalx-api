import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { AppError } from "@shared/errors/AppError";
import { IUserTokensRepository } from "@modules/accounts/repositories/IUsersTokenRepository";
import auth from "@config/auth";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: { name: string; email: string };
  token: string;
  refreshToken: string
}

@injectable()
class AuthenticateUserUseCase {
  constructor(
    @inject("UserRepository") private usersRepository: IUsersRepository,
    @inject("UsersTokensRepository")
    private usersTokensRepository: IUserTokensRepository,
    @inject("DayjsDateProvider")
    private dayjsDateProvider: IDateProvider
  ) {}

  async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) throw new AppError("Email or password incorrect!");

    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) throw new AppError("Email or password incorrect!");

    const token = sign({}, auth.secret_token, {
      subject: user.id,
      expiresIn: auth.expires_in_token,
    });

    const refreshToken = sign({ email }, auth.secret_refresh_token, {
      subject: user.id,
      expiresIn: auth.expires_in_refresh_token,
    });

    await this.usersTokensRepository.create({
      user_id: user.id,
      expires_date: this.dayjsDateProvider.addDays(
        auth.expires_refresh_token_days
      ),
      refresh_token: refreshToken,
    });

    return {
      user: {
        name: user.name,
        email: user.email,
      },
      token,
      refreshToken
    };
  }
}

export { AuthenticateUserUseCase };
