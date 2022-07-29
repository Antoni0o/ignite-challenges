import { getRepository, Repository } from "typeorm";

import { Statement } from "../entities/Statement";
import { Transfer } from "../../transfers/entities/Transfer";
import { ICreateStatementDTO } from "../useCases/createStatement/ICreateStatementDTO";
import { IGetBalanceDTO } from "../useCases/getBalance/IGetBalanceDTO";
import { IGetStatementOperationDTO } from "../useCases/getStatementOperation/IGetStatementOperationDTO";
import { IStatementsRepository } from "./IStatementsRepository";

export class StatementsRepository implements IStatementsRepository {
  private repository: Repository<Statement>;
  private transfersRepository: Repository<Transfer>;

  constructor() {
    this.repository = getRepository(Statement);
    this.transfersRepository = getRepository(Transfer);
  }

  async create({
    user_id,
    amount,
    description,
    type
  }: ICreateStatementDTO): Promise<Statement> {
    const statement = this.repository.create({
      user_id,
      amount,
      description,
      type
    });

    return this.repository.save(statement);
  }

  async findStatementOperation({ statement_id, user_id }: IGetStatementOperationDTO): Promise<Statement | undefined> {
    return this.repository.findOne(statement_id, {
      where: { user_id }
    });
  }

  async getUserBalance({ user_id, with_statement = false }: IGetBalanceDTO):
    Promise<
      { balance: number } | { balance: number, statement: Statement[], transfers: Transfer[] }
    >
  {

    const statement = await this.repository.find({
      where: { user_id }
    });

    const transfers = await this.transfersRepository.find({
      where: { sender_id: user_id }
    });

    const transfersBalance = transfers.reduce((acc, operation) => {
      return acc + operation.amount;
    }, 0);

    const statementsBalance = statement.reduce((acc, operation) => {
      if (operation.type === 'deposit' || 'transfer') {
        return acc + operation.amount;
      } else {
        return acc - operation.amount;
      }
    }, 0);

    const balance = statementsBalance - transfersBalance;

    if (with_statement) {
      return {
        statement,
        balance
      }
    }

    return { balance }
  }
}
