import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedUpdatedAt1746127198506 implements MigrationInterface {
    name = 'AddedUpdatedAt1746127198506'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`queue\` ADD \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`queue\` DROP COLUMN \`updated_at\``);
    }

}
