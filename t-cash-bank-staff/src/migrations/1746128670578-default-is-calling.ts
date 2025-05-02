import { MigrationInterface, QueryRunner } from "typeorm";

export class DefaultIsCalling1746128670578 implements MigrationInterface {
    name = 'DefaultIsCalling1746128670578'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`queue\` CHANGE \`is_calling\` \`is_calling\` tinyint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`queue\` CHANGE \`is_calling\` \`is_calling\` tinyint NOT NULL`);
    }

}
