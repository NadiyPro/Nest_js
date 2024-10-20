import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBio1ToUser1729464939184 implements MigrationInterface {
    name = 'AddBio1ToUser1729464939184'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "bio" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "bio" DROP NOT NULL`);
    }

}
