import 'dotenv/config';
import 'reflect-metadata';
import path from 'path';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const AppDataSource = new DataSource({
    type: process.env.DB_TYPE as any,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false,
    logging: true,
    entities: [path.join(__dirname, '..', '/entity/*.js')],
    subscribers: [],
    migrations: [path.join(__dirname, '..', '/migrations/*.js')],
    namingStrategy: new SnakeNamingStrategy(),
    migrationsRun: false,
    maxQueryExecutionTime: 1000,
});
