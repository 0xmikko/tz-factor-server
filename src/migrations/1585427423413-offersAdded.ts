import {MigrationInterface, QueryRunner} from "typeorm";

export class offersAdded1585427423413 implements MigrationInterface {
    name = 'offersAdded1585427423413'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "offer" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" character varying NOT NULL DEFAULT 'New', "bondId" integer NOT NULL DEFAULT 0, "account" character varying NOT NULL DEFAULT '', "amount" integer NOT NULL DEFAULT 0, "sold" integer NOT NULL DEFAULT 0, "price" integer NOT NULL DEFAULT 0, CONSTRAINT "PK_57c6ae1abe49201919ef68de900" PRIMARY KEY ("id"))`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "offer"`, undefined);
    }

}
