import { getRepository, Repository } from "typeorm";
import { OperationType, Transfer } from "../entities/Transfer";
import { ICreateTransferDTO } from "../useCases/createTransfer/ICreateTransferDTO";
import { ITransfersRepository } from "./ITransfersRepository";

export class TransfersRepository implements ITransfersRepository {
  private repository: Repository<Transfer>;

  constructor() {
    this.repository = getRepository(Transfer);
  }

  async create({ sender_id, amount, description }: ICreateTransferDTO): Promise<Transfer> {
    const transfer = this.repository.create({
      sender_id,
      amount,
      description,
      type: OperationType.TRANSFER,
    });

    return this.repository.save(transfer);
  };
}
