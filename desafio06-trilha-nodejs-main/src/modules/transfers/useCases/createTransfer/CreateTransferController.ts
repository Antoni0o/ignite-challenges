import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateStatementUseCase } from './CreateTransferUseCase';

export class CreateTransferController {
  async execute(request: Request, response: Response) {
    const { id: sender_id } = request.user;
    const { user_id: receiver_id } = request.params;
    const { amount, description } = request.body;

    const createTransfer = container.resolve(CreateStatementUseCase);

    const transfer = await createTransfer.execute({
      sender_id,
      receiver_id,
      amount,
      description
    });

    return response.status(201).json(transfer);
  }
}
