// src/entity/Admin.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
  } from 'typeorm';
  
  @Entity({ name: 'admins' })
  export class Admin {
    @PrimaryGeneratedColumn({ name: 'admin_id' })
    id: number;
  
    @Column({ length: 50, unique: true })
    username: string;
  
    @Column({ length: 255 })
    password: string;
  
    @Column({ length: 100, nullable: true })
    email?: string;
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  }
  