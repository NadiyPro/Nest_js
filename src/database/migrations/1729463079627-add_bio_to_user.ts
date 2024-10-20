import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBioToUser1729463079627 implements MigrationInterface {
    name = 'AddBioToUser1729463079627'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "bio" character varying`);



    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "bio"`);
    }

}
