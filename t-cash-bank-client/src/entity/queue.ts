// src/entity/Queue.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Client } from './client';
import { Service } from './service';

export enum QueueStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
}

@Entity({ name: 'queue' })
export class Queue {
  @PrimaryGeneratedColumn({ name: 'queue_id' })
  id: number;

  @ManyToOne(() => Client, (client) => client.queues)
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @ManyToOne(() => Service, (service) => service.queues)
  @JoinColumn({ name: 'service_id' })
  service: Service;

  @Column({ name: 'assigned_counter', length: 50 })
  assignedCounter: string;

  @Column({ name: 'ticket_number', length: 10 })
  ticketNumber: string;

  @CreateDateColumn({ name: 'timestamp' })
  timestamp: Date;

  @Column({ name: 'completed_at', type: 'timestamp', nullable: true })
  completedAt?: Date;

  @Column({ type: 'enum', enum: QueueStatus, default: QueueStatus.PENDING })
  status: QueueStatus;

  @Column({ default: false })
  isCalling: boolean;

  @UpdateDateColumn()
  updatedAt: Date;
}
