import { User } from "../../model/User";
import { IUsersRepository } from "../../repositories/IUsersRepository";

interface IRequest {
  user_id: string;
}

class TurnUserAdminUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  execute({ user_id }: IRequest): User {
    const isUser = this.usersRepository.findById(user_id);

    if (!isUser) {
      throw new Error("The user not exists");
    }

    const user = this.usersRepository.turnAdmin(isUser);

    return user;
  }
}

export { TurnUserAdminUseCase };
