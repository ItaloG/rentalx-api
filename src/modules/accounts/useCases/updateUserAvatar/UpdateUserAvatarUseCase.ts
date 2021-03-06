import { inject, injectable } from "tsyringe";
import { deleteFile } from "@utils/file";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";

interface IResquest {
  user_id: string;
  avatar_file: string;
}

@injectable()
class UpdateUserAvatarUseCase {
  constructor(
    @inject("UsersRepository") private usersRepository: IUsersRepository
  ) {}
  async execute({ user_id, avatar_file }: IResquest): Promise<void> {
    const user = await this.usersRepository.findById(user_id);

    if (user.avatar) await deleteFile(`./tbm/avatar/${user.avatar}`);

    user.avatar = avatar_file;

    await this.usersRepository.create(user);
  }
}

export { UpdateUserAvatarUseCase };
