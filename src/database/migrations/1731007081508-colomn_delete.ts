import { MigrationInterface, QueryRunner } from "typeorm";

export class ColomnDelete1731007081508 implements MigrationInterface {
    name = 'ColomnDelete1731007081508'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "deleted" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "deleted"`);
    }

}
