import { MigrationInterface, QueryRunner } from "typeorm";

export class IsStaffOnline1746186458301 implements MigrationInterface {
    name = 'IsStaffOnline1746186458301'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`staff\` ADD \`is_online\` tinyint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`staff\` DROP COLUMN \`is_online\``);
    }

}
