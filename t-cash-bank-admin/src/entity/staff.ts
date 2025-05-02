// src/entity/Staff.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export enum StaffRole {
  ADMIN = 'admin',
  STAFF = 'staff',
}

@Entity({ name: 'staff' })
export class Staff {
  @PrimaryGeneratedColumn({ name: 'staff_id' })
  id: number;

  @Column({ length: 255, unique: true })
  username: string;

  @Column({ length: 255 })
  password: string;

  @Column({ type: 'enum', enum: StaffRole })
  role: StaffRole;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'temporary_password', length: 255, default: 'yes' })
  temporaryPassword: string;

  @Column({ name: 'counter_assigned', length: 255, nullable: true })
  counterAssigned?: string;

  @Column({ default: false })
  isOnline: boolean;
}
