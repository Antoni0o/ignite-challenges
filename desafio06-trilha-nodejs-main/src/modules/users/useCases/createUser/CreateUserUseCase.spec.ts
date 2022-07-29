import { validate } from "uuid";

import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";

import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let usersReposityoryInMemory: InMemoryUsersRepository;

describe("Create Statement", () => {
  beforeEach(() => {
    usersReposityoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersReposityoryInMemory);
  });

  it("should be able to create a new user", async () => {
    const user = await createUserUseCase.execute({
      email: "test@test.com",
      name: "TestUser",
      password: "123456"
    });
  });

  it("should not be able to create a user if the email already exists", async () => {
    expect(async () => {
      await createUserUseCase.execute({
        email: "test@test.com",
        name: "TestUser",
        password: "123456"
      });
      await createUserUseCase.execute({
        email: "test@test.com",
        name: "TestUser",
        password: "123456"
      });
    }).rejects.toBeInstanceOf(CreateUserError)
  });
});