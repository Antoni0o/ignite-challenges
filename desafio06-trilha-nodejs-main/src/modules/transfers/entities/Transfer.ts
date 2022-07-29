import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { v4 as uuid } from 'uuid';

import { User } from '../../users/entities/User';

enum OperationType {
  TRANSFER = 'transfer',
}

@Entity('transfers')
export class Transfer {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column('uuid')
  sender_id: string;

  @ManyToOne(() => User, user => user.transfers)
  @JoinColumn({ name: 'sender_id' })
  sender: User;

  @Column()
  description: string;

  @Column('decimal', { precision: 5, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: OperationType })
  type: OperationType;

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  updated_at: Date;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }

    if (!this.type) {
      this.type = OperationType.TRANSFER;
    }
  }
}

export {OperationType};