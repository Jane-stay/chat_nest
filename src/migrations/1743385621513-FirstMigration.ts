import { MigrationInterface, QueryRunner } from "typeorm";

export class FirstMigration1743385621513 implements MigrationInterface {
    name = 'FirstMigration1743385621513'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "message" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isActive" boolean, "content" character varying NOT NULL, "chatRoomId" uuid, "senderId" uuid, CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "chat_room" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isActive" boolean, "name" character varying NOT NULL, CONSTRAINT "PK_8aa3a52cf74c96469f0ef9fbe3e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isActive" boolean, "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "chat_room_participants_user" ("chatRoomId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_f4d47b6834439f670e93db2e3e9" PRIMARY KEY ("chatRoomId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_fd0350d006a2fcb072030ae8a0" ON "chat_room_participants_user" ("chatRoomId") `);
        await queryRunner.query(`CREATE INDEX "IDX_16f2408eb656d0b12245241dcb" ON "chat_room_participants_user" ("userId") `);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_f3cc0ca0c4b191410f1e0ab5d21" FOREIGN KEY ("chatRoomId") REFERENCES "chat_room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_bc096b4e18b1f9508197cd98066" FOREIGN KEY ("senderId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_room_participants_user" ADD CONSTRAINT "FK_fd0350d006a2fcb072030ae8a07" FOREIGN KEY ("chatRoomId") REFERENCES "chat_room"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "chat_room_participants_user" ADD CONSTRAINT "FK_16f2408eb656d0b12245241dcb9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chat_room_participants_user" DROP CONSTRAINT "FK_16f2408eb656d0b12245241dcb9"`);
        await queryRunner.query(`ALTER TABLE "chat_room_participants_user" DROP CONSTRAINT "FK_fd0350d006a2fcb072030ae8a07"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_bc096b4e18b1f9508197cd98066"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_f3cc0ca0c4b191410f1e0ab5d21"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_16f2408eb656d0b12245241dcb"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fd0350d006a2fcb072030ae8a0"`);
        await queryRunner.query(`DROP TABLE "chat_room_participants_user"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "chat_room"`);
        await queryRunner.query(`DROP TABLE "message"`);
    }

}
