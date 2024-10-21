import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSomeRows1729513432307 implements MigrationInterface {
    name = 'AddSomeRows1729513432307'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "bio"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "bio" text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "bio"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "bio" character varying NOT NULL`);
    }

}
