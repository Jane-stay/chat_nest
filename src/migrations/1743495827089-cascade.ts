import { MigrationInterface, QueryRunner } from "typeorm";

export class Cascade1743495827089 implements MigrationInterface {
    name = 'Cascade1743495827089'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_f3cc0ca0c4b191410f1e0ab5d21"`);
        await queryRunner.query(`ALTER TABLE "message" ALTER COLUMN "isActive" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "message" ALTER COLUMN "isActive" SET DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "chat_room" ALTER COLUMN "isActive" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "chat_room" ALTER COLUMN "isActive" SET DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "isActive" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "isActive" SET DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_f3cc0ca0c4b191410f1e0ab5d21" FOREIGN KEY ("chatRoomId") REFERENCES "chat_room"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_f3cc0ca0c4b191410f1e0ab5d21"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "isActive" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "isActive" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "chat_room" ALTER COLUMN "isActive" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "chat_room" ALTER COLUMN "isActive" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "message" ALTER COLUMN "isActive" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "message" ALTER COLUMN "isActive" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_f3cc0ca0c4b191410f1e0ab5d21" FOREIGN KEY ("chatRoomId") REFERENCES "chat_room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
