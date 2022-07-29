import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { OperationType } from "../../entities/Statement";

let getStatementOperationUseCase: GetStatementOperationUseCase;
let createUserUseCase: CreateUserUseCase;
let statementsRepositoryInMemory: InMemoryStatementsRepository;
let usersRepositoryInMemory: InMemoryUsersRepository;
let createStatementUseCase: CreateStatementUseCase;

describe("Get Statement Operation", () => {
  beforeEach(() => {
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepositoryInMemory, statementsRepositoryInMemory);
    createStatementUseCase = new CreateStatementUseCase(usersRepositoryInMemory, statementsRepositoryInMemory);
  });

  it("should be able to get statement operation", async () => {
    const user: ICreateUserDTO = {
      name: "Test",
      email: "test@email.com",
      password: "12345"
    };

    const { id } = await createUserUseCase.execute(user);

    const statement = await createStatementUseCase.execute({
      user_id: id as string,
      type: OperationType.DEPOSIT,
      amount: 1000,
      description: "test"
    });

    const result = await getStatementOperationUseCase.execute({
      user_id: id as string,
      statement_id: statement.id as string
    });

    expect(result).toMatchObject({
      type: 'deposit',
      amount: 1000,
      description: 'test'
    });
  });

  it("should not be able to get statement operation if the user not exists", async () => {
    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: "12345",
        statement_id: "122234"
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("should not be able to get statement operation if the statement not found", async () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: "Test",
        email: "test@email.com",
        password: "12345"
      };
  
      const { id } = await createUserUseCase.execute(user);
  
      await createStatementUseCase.execute({
        user_id: id as string,
        type: OperationType.DEPOSIT,
        amount: 1000,
        description: "test"
      });
  
      await getStatementOperationUseCase.execute({
        user_id: id as string,
        statement_id: "12345"
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
});