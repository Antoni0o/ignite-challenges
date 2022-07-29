import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError"

let showUserProfileUseCase: ShowUserProfileUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create Statement", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepositoryInMemory);
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("should be able to show a user profile", async () => {
    const user: ICreateUserDTO = {
      name: "Test",
      email: "test@email.com",
      password: "12345"
    }
    const { id } = await createUserUseCase.execute(user);

    const result = await showUserProfileUseCase.execute(id as string);
    
    expect(result).toMatchObject({
      name: "Test",
      email: "test@email.com",
    })
  });

  it("should not be able to show a user profile if the user not exists", async () => {
    expect(async () => {
      await showUserProfileUseCase.execute("215649");
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});