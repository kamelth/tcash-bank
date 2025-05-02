// src/entity/Client.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
  } from 'typeorm';
  import { Queue } from './queue';
  
  export enum ClientType {
    REGULAR = 'regular',
    VIP = 'vip',
    SPECIAL = 'special',
  }
  
  @Entity({ name: 'clients' })
  export class Client {
    @PrimaryGeneratedColumn({ name: 'client_id' })
    id: number;
  
    @Column({ length: 255 })
    name: string;
  
    @Column({ length: 20 })
    phone: string;
  
    @Column({ type: 'enum', enum: ClientType, name: 'client_type' })
    clientType: ClientType;
  
    @OneToMany(() => Queue, (queue) => queue.client)
    queues: Queue[];
  }
  