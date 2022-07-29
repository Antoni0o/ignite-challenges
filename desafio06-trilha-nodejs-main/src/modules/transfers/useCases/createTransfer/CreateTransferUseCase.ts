import { inject, injectable } from "tsyringe";
import { OperationType } from "../../../statements/entities/Statement";
import { IStatementsRepository } from "../../../statements/repositories/IStatementsRepository";

import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { ITransfersRepository } from "../../repositories/ITransfersRepository";
import { CreateTransferError } from "./CreateTransferError";
import { ICreateTransferDTO } from "./ICreateTransferDTO";

@injectable()
export class CreateStatementUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('TransfersRepository')
    private transfersRepository: ITransfersRepository,

    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository,
  ) {}

  async execute({receiver_id, sender_id, amount, description}: ICreateTransferDTO) {
    const receiver = await this.usersRepository.findById(receiver_id as string);
    const sender = await this.usersRepository.findById(sender_id as string);

    if (!receiver) {
      throw new CreateTransferError.UserNotFound();
    }
    if(!sender) {
      throw new CreateTransferError.UserNotFound();
    }

    const { balance } = await this.statementsRepository.getUserBalance({ user_id: sender_id });

    if(balance < amount) {
      throw new CreateTransferError.InsufficientFunds()
    }

    const transfer = await this.transfersRepository.create({ sender_id, amount, description });
    
    await this.statementsRepository.create({ amount, description, user_id: receiver_id as string, type: OperationType.TRANSFER });

    return transfer;
  }
}
