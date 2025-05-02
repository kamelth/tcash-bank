// src/entity/Service.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
  } from 'typeorm';
  import { Queue } from './queue';
  
  @Entity({ name: 'services' })
  export class Service {
    @PrimaryGeneratedColumn({ name: 'service_id' })
    id: number;
  
    @Column({ name: 'service_name', length: 50 })
    serviceName: string;
  
    @OneToMany(() => Queue, (queue) => queue.service)
    queues: Queue[];
  }
  