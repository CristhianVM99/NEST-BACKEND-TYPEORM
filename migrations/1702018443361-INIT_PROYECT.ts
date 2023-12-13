import { MigrationInterface, QueryRunner } from "typeorm";

export class INITPROYECT1702018443361 implements MigrationInterface {
    name = 'INITPROYECT1702018443361'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."tasks_status_enum" AS ENUM('NEW', 'IN_PROGRESS', 'COMPLETED', 'CANCELED')`);
        await queryRunner.query(`CREATE TABLE "tasks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying NOT NULL, "description" character varying NOT NULL, "due_date" TIMESTAMP NOT NULL, "status" "public"."tasks_status_enum" NOT NULL, "list_id" uuid, CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "lists" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying NOT NULL, "description" character varying NOT NULL, "board_id" uuid, CONSTRAINT "PK_268b525e9a6dd04d0685cb2aaaa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_gender_enum" AS ENUM('MALE', 'FEMALE', 'OTRO')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "email" character varying NOT NULL, "username" character varying NOT NULL, "age" integer NOT NULL, "password" character varying NOT NULL, "gender" "public"."users_gender_enum" NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "boards" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_606923b0b068ef262dfdcd18f44" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users_boards_boards" ("users_id" uuid NOT NULL, "boards_id" uuid NOT NULL, CONSTRAINT "PK_e8c2a516aad4866e404ac877a2e" PRIMARY KEY ("users_id", "boards_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_50b587d3fa8f39b78159f063a3" ON "users_boards_boards" ("users_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_8b25aad66a0ec8386a2c26a90b" ON "users_boards_boards" ("boards_id") `);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_f69dc09246817393a46eb2a47c5" FOREIGN KEY ("list_id") REFERENCES "lists"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lists" ADD CONSTRAINT "FK_df6934914bb17e5783e6850a854" FOREIGN KEY ("board_id") REFERENCES "boards"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_boards_boards" ADD CONSTRAINT "FK_50b587d3fa8f39b78159f063a3e" FOREIGN KEY ("users_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "users_boards_boards" ADD CONSTRAINT "FK_8b25aad66a0ec8386a2c26a90b9" FOREIGN KEY ("boards_id") REFERENCES "boards"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_boards_boards" DROP CONSTRAINT "FK_8b25aad66a0ec8386a2c26a90b9"`);
        await queryRunner.query(`ALTER TABLE "users_boards_boards" DROP CONSTRAINT "FK_50b587d3fa8f39b78159f063a3e"`);
        await queryRunner.query(`ALTER TABLE "lists" DROP CONSTRAINT "FK_df6934914bb17e5783e6850a854"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_f69dc09246817393a46eb2a47c5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8b25aad66a0ec8386a2c26a90b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_50b587d3fa8f39b78159f063a3"`);
        await queryRunner.query(`DROP TABLE "users_boards_boards"`);
        await queryRunner.query(`DROP TABLE "boards"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_gender_enum"`);
        await queryRunner.query(`DROP TABLE "lists"`);
        await queryRunner.query(`DROP TABLE "tasks"`);
        await queryRunner.query(`DROP TYPE "public"."tasks_status_enum"`);
    }

}
