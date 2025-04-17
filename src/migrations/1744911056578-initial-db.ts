import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialDb1744911056578 implements MigrationInterface {
    name = 'InitialDb1744911056578'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`staff\` (\`staff_id\` int NOT NULL AUTO_INCREMENT, \`username\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`role\` enum ('admin', 'staff') NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`temporary_password\` varchar(255) NOT NULL DEFAULT 'yes', \`counter_assigned\` varchar(255) NULL, UNIQUE INDEX \`IDX_35aafb5ad218f3ff1ff70e281e\` (\`username\`), PRIMARY KEY (\`staff_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`clients\` (\`client_id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`phone\` varchar(20) NOT NULL, \`client_type\` enum ('regular', 'vip', 'special') NOT NULL, PRIMARY KEY (\`client_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`queue\` (\`queue_id\` int NOT NULL AUTO_INCREMENT, \`assigned_counter\` varchar(50) NOT NULL, \`ticket_number\` varchar(10) NOT NULL, \`timestamp\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`completed_at\` timestamp NULL, \`status\` enum ('pending', 'completed') NOT NULL DEFAULT 'pending', \`client_id\` int NULL, \`service_id\` int NULL, PRIMARY KEY (\`queue_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`services\` (\`service_id\` int NOT NULL AUTO_INCREMENT, \`service_name\` varchar(50) NOT NULL, PRIMARY KEY (\`service_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`admins\` (\`admin_id\` int NOT NULL AUTO_INCREMENT, \`username\` varchar(50) NOT NULL, \`password\` varchar(255) NOT NULL, \`email\` varchar(100) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_4ba6d0c734d53f8e1b2e24b6c5\` (\`username\`), PRIMARY KEY (\`admin_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`queue\` ADD CONSTRAINT \`FK_3bf5e67f73bc119c2330e139c16\` FOREIGN KEY (\`client_id\`) REFERENCES \`clients\`(\`client_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`queue\` ADD CONSTRAINT \`FK_19fc6747348ad4614ebba9ed768\` FOREIGN KEY (\`service_id\`) REFERENCES \`services\`(\`service_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`queue\` DROP FOREIGN KEY \`FK_19fc6747348ad4614ebba9ed768\``);
        await queryRunner.query(`ALTER TABLE \`queue\` DROP FOREIGN KEY \`FK_3bf5e67f73bc119c2330e139c16\``);
        await queryRunner.query(`DROP INDEX \`IDX_4ba6d0c734d53f8e1b2e24b6c5\` ON \`admins\``);
        await queryRunner.query(`DROP TABLE \`admins\``);
        await queryRunner.query(`DROP TABLE \`services\``);
        await queryRunner.query(`DROP TABLE \`queue\``);
        await queryRunner.query(`DROP TABLE \`clients\``);
        await queryRunner.query(`DROP INDEX \`IDX_35aafb5ad218f3ff1ff70e281e\` ON \`staff\``);
        await queryRunner.query(`DROP TABLE \`staff\``);
    }

}
