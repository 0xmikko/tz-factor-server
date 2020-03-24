import {MigrationInterface, QueryRunner} from "typeorm";

export class AccountsIdChanged1584974703893 implements MigrationInterface {
    name = 'AccountsIdChanged1584974703893'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_04d0b17bc3974d4068b15831fd1"`, undefined);
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_ceca9f948aecebf0ae00f43b740"`, undefined);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "fromId"`, undefined);
        await queryRunner.query(`ALTER TABLE "payment" ADD "fromId" character varying`, undefined);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "toId"`, undefined);
        await queryRunner.query(`ALTER TABLE "payment" ADD "toId" character varying`, undefined);
        await queryRunner.query(`ALTER TABLE "account" DROP CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea"`, undefined);
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "id"`, undefined);
        await queryRunner.query(`ALTER TABLE "account" ADD "id" character varying NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "account" ADD CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id")`, undefined);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_04d0b17bc3974d4068b15831fd1" FOREIGN KEY ("fromId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_ceca9f948aecebf0ae00f43b740" FOREIGN KEY ("toId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_ceca9f948aecebf0ae00f43b740"`, undefined);
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_04d0b17bc3974d4068b15831fd1"`, undefined);
        await queryRunner.query(`ALTER TABLE "account" DROP CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea"`, undefined);
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "id"`, undefined);
        await queryRunner.query(`ALTER TABLE "account" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`, undefined);
        await queryRunner.query(`ALTER TABLE "account" ADD CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id")`, undefined);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "toId"`, undefined);
        await queryRunner.query(`ALTER TABLE "payment" ADD "toId" uuid`, undefined);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "fromId"`, undefined);
        await queryRunner.query(`ALTER TABLE "payment" ADD "fromId" uuid`, undefined);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_ceca9f948aecebf0ae00f43b740" FOREIGN KEY ("toId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_04d0b17bc3974d4068b15831fd1" FOREIGN KEY ("fromId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

}
