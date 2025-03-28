import { MigrationInterface, QueryRunner } from "typeorm";

export class IsActiveNullable1743142657944 implements MigrationInterface {
    name = 'IsActiveNullable1743142657944'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "isActive" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "chat_room" ALTER COLUMN "isActive" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chat_room" ALTER COLUMN "isActive" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "isActive" SET NOT NULL`);
    }

}
