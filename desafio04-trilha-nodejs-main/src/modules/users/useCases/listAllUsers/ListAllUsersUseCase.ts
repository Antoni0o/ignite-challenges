import { User } from "../../model/User";
import { IUsersRepository } from "../../repositories/IUsersRepository";

interface IRequest {
  user_id: string;
}

class ListAllUsersUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  execute({ user_id }: IRequest): User[] {
    const user = this.usersRepository.findById(user_id);

    if (!user) {
      throw new Error("The user requester not exists!");
    }

    if (!user.admin) {
      throw new Error("The user requester is not an Admin!");
    }

    return this.usersRepository.list();
  }
}

export { ListAllUsersUseCase };
