import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedIsCalling1746126537081 implements MigrationInterface {
    name = 'AddedIsCalling1746126537081'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`queue\` DROP FOREIGN KEY \`queue_ibfk_1\``);
        await queryRunner.query(`ALTER TABLE \`queue\` DROP FOREIGN KEY \`queue_ibfk_2\``);
        await queryRunner.query(`DROP INDEX \`username\` ON \`staff\``);
        await queryRunner.query(`DROP INDEX \`client_id\` ON \`queue\``);
        await queryRunner.query(`DROP INDEX \`service_id\` ON \`queue\``);
        await queryRunner.query(`DROP INDEX \`username\` ON \`admins\``);
        await queryRunner.query(`ALTER TABLE \`queue\` ADD \`is_calling\` tinyint NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`staff\` CHANGE \`username\` \`username\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`staff\` ADD UNIQUE INDEX \`IDX_35aafb5ad218f3ff1ff70e281e\` (\`username\`)`);
        await queryRunner.query(`ALTER TABLE \`staff\` DROP COLUMN \`created_at\``);
        await queryRunner.query(`ALTER TABLE \`staff\` ADD \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`staff\` CHANGE \`temporary_password\` \`temporary_password\` varchar(255) NOT NULL DEFAULT 'yes'`);
        await queryRunner.query(`ALTER TABLE \`queue\` DROP COLUMN \`timestamp\``);
        await queryRunner.query(`ALTER TABLE \`queue\` ADD \`timestamp\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`queue\` CHANGE \`status\` \`status\` enum ('pending', 'completed') NOT NULL DEFAULT 'pending'`);
        await queryRunner.query(`ALTER TABLE \`queue\` CHANGE \`client_id\` \`client_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`queue\` CHANGE \`service_id\` \`service_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`admins\` CHANGE \`username\` \`username\` varchar(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`admins\` ADD UNIQUE INDEX \`IDX_4ba6d0c734d53f8e1b2e24b6c5\` (\`username\`)`);
        await queryRunner.query(`ALTER TABLE \`admins\` CHANGE \`created_at\` \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`queue\` ADD CONSTRAINT \`FK_3bf5e67f73bc119c2330e139c16\` FOREIGN KEY (\`client_id\`) REFERENCES \`clients\`(\`client_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`queue\` ADD CONSTRAINT \`FK_19fc6747348ad4614ebba9ed768\` FOREIGN KEY (\`service_id\`) REFERENCES \`services\`(\`service_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`queue\` DROP FOREIGN KEY \`FK_19fc6747348ad4614ebba9ed768\``);
        await queryRunner.query(`ALTER TABLE \`queue\` DROP FOREIGN KEY \`FK_3bf5e67f73bc119c2330e139c16\``);
        await queryRunner.query(`ALTER TABLE \`admins\` CHANGE \`created_at\` \`created_at\` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`admins\` DROP INDEX \`IDX_4ba6d0c734d53f8e1b2e24b6c5\``);
        await queryRunner.query(`ALTER TABLE \`admins\` CHANGE \`username\` \`username\` varchar(50) COLLATE "utf8mb4_general_ci" NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`queue\` CHANGE \`service_id\` \`service_id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`queue\` CHANGE \`client_id\` \`client_id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`queue\` CHANGE \`status\` \`status\` enum COLLATE "utf8mb4_general_ci" ('pending', 'completed') NULL DEFAULT 'pending'`);
        await queryRunner.query(`ALTER TABLE \`queue\` DROP COLUMN \`timestamp\``);
        await queryRunner.query(`ALTER TABLE \`queue\` ADD \`timestamp\` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`staff\` CHANGE \`temporary_password\` \`temporary_password\` varchar(255) COLLATE "utf8mb4_general_ci" NULL DEFAULT 'yes'`);
        await queryRunner.query(`ALTER TABLE \`staff\` DROP COLUMN \`created_at\``);
        await queryRunner.query(`ALTER TABLE \`staff\` ADD \`created_at\` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`staff\` DROP INDEX \`IDX_35aafb5ad218f3ff1ff70e281e\``);
        await queryRunner.query(`ALTER TABLE \`staff\` CHANGE \`username\` \`username\` varchar(255) COLLATE "utf8mb4_general_ci" NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`queue\` DROP COLUMN \`is_calling\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`username\` ON \`admins\` (\`username\`)`);
        await queryRunner.query(`CREATE INDEX \`service_id\` ON \`queue\` (\`service_id\`)`);
        await queryRunner.query(`CREATE INDEX \`client_id\` ON \`queue\` (\`client_id\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`username\` ON \`staff\` (\`username\`)`);
        await queryRunner.query(`ALTER TABLE \`queue\` ADD CONSTRAINT \`queue_ibfk_2\` FOREIGN KEY (\`service_id\`) REFERENCES \`services\`(\`service_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`queue\` ADD CONSTRAINT \`queue_ibfk_1\` FOREIGN KEY (\`client_id\`) REFERENCES \`clients\`(\`client_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
