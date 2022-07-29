import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<any> {
    return this.repository
      .createQueryBuilder("game")
      .where("game.title ILIKE '%' || :title || '%'", { title: param })
      .getMany();
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query('SELECT count(\*) FROM games'); // Complete usando raw query
  }

  async findUsersByGameId(id: string): Promise<any> {
    const user = this.repository
    .createQueryBuilder("game")
    .where("game.id = :id", { id: id })
    .leftJoinAndSelect("game.users", "user")
    .getOne();
    return (await user).users;
  }
}
