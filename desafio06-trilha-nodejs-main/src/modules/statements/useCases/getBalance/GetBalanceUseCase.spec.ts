import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { GetBalanceUseCase } from "./GetBalanceUseCase";
import { GetBalanceError } from "./GetBalanceError";

let getBalanceUseCase: GetBalanceUseCase;
let createUserUseCase: CreateUserUseCase;
let getBalanceRepositoryInMemory: InMemoryStatementsRepository;
let usersRepositoryInMemory: InMemoryUsersRepository;

describe("Get Balance", () => {
  beforeEach(() => {
    getBalanceRepositoryInMemory = new InMemoryStatementsRepository();
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    getBalanceUseCase = new GetBalanceUseCase(getBalanceRepositoryInMemory, usersRepositoryInMemory);
  });

  it("should be able to get a balance", async () => {
    const user: ICreateUserDTO = {
      name: "Test",
      email: "test@email.com",
      password: "12345"
    };
    const { id } = await createUserUseCase.execute(user);

    const result = await getBalanceUseCase.execute({user_id: id as string});

    expect(result).toMatchObject({
      balance: 0,
    });
  });

  it("should not be able to get a balance", async () => {
    expect(async () => {
      await getBalanceUseCase.execute({user_id: "12345"});
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});