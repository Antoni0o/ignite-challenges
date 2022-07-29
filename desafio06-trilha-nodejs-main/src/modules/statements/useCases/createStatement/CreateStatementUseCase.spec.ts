import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { CreateStatementError } from "./CreateStatementError";
import { OperationType } from "../../entities/Statement";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";

let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;
let statementRepositoryInMemory: InMemoryStatementsRepository;
let usersRepositoryInMemory: InMemoryUsersRepository;

describe("Create Statement", () => {
  beforeEach(() => {
    statementRepositoryInMemory = new InMemoryStatementsRepository();
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    createStatementUseCase = new CreateStatementUseCase(usersRepositoryInMemory, statementRepositoryInMemory);
  });

  it("should be able to create a deposit statement", async () => {
    const user: ICreateUserDTO = {
      name: "Test",
      email: "test@email.com",
      password: "12345"
    }
    const { id } = await createUserUseCase.execute(user);

    const result = await createStatementUseCase.execute({
      user_id: id as string,
      type: OperationType.DEPOSIT,
      amount: 1000,
      description: "test"
    });

    expect(result).toMatchObject({
      type: 'deposit',
      amount: 1000,
      description: "test"
    });
  });

  it("should be able to create a withdraw statement", async () => {
    const user: ICreateUserDTO = {
      name: "Test",
      email: "test@email.com",
      password: "12345"
    }
    const { id } = await createUserUseCase.execute(user);

    await createStatementUseCase.execute({
      user_id: id as string,
      type: OperationType.DEPOSIT,
      amount: 1500,
      description: "test"
    });

    const result = await createStatementUseCase.execute({
      user_id: id as string,
      type: OperationType.WITHDRAW,
      amount: 500,
      description: "test"
    });

    expect(result).toMatchObject({
      type: 'withdraw',
      amount: 500,
      description: "test"
    });
  });

  it("should not be able to create a statement if the user not exists", async () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: "12468",
        type: OperationType.WITHDRAW,
        amount: 500,
        description: "test"
      }); 
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("should not be able to create a withdraw statement if the user have insufficient funds", async () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: "Test",
        email: "test@email.com",
        password: "12345"
      }
      const { id } = await createUserUseCase.execute(user);
  
      await createStatementUseCase.execute({
        user_id: id as string,
        type: OperationType.WITHDRAW,
        amount: 500,
        description: "test"
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
});