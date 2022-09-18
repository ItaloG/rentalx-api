import auth from "@config/auth";
import { IUserTokensRepository } from "@modules/accounts/repositories/IUsersTokenRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";
import { sign, verify } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

interface IPayload {
  sub: string;
  email: string;
}

@injectable()
class RefreshTokenUseCase {
  constructor(
    @inject("UsersTokenRepository")
    private usersTokenRepository: IUserTokensRepository,
    @inject("DayjsDateProvider")
    private dayjsDateProvider: IDateProvider
  ) {}

  async execute(token: string): Promise<string> {
    const decode = verify(token, auth.secret_refresh_token) as IPayload;
    const userId = decode.sub;

    const userToken =
      await this.usersTokenRepository.findByUserIdAndRefreshToken(
        <string>userId,
        token
      );

    if (!userToken) throw new AppError("Refresh token does not exits!");

    const refreshToken = sign(
      { email: decode.email },
      auth.secret_refresh_token,

      {
        subject: decode.sub,
        expiresIn: auth.expires_in_refresh_token,
      }
    );

    await this.usersTokenRepository.create({
      expires_date: this.dayjsDateProvider.addDays(
        auth.expires_refresh_token_days
      ),
      refresh_token: refreshToken,
      user_id: userId,
    });

    return refreshToken;
  }
}

export { RefreshTokenUseCase };
