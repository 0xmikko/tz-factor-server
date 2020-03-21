import {MigrationInterface, QueryRunner} from "typeorm";

export class payment1584708506717 implements MigrationInterface {
    name = 'payment1584708506717'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "bond_share" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" integer NOT NULL, "bondId" uuid, "ownerId" uuid, CONSTRAINT "PK_30487fb37b905c48850cf13654a" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "bond" DROP COLUMN "createdAt"`, undefined);
        await queryRunner.query(`ALTER TABLE "payment" ADD "fromId" uuid`, undefined);
        await queryRunner.query(`ALTER TABLE "payment" ADD "toId" uuid`, undefined);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_04d0b17bc3974d4068b15831fd1" FOREIGN KEY ("fromId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_ceca9f948aecebf0ae00f43b740" FOREIGN KEY ("toId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "bond_share" ADD CONSTRAINT "FK_5503cb15af3ea26b0eebb45bbe4" FOREIGN KEY ("bondId") REFERENCES "bond"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "bond_share" ADD CONSTRAINT "FK_19ee26b23edff5631e9fc649812" FOREIGN KEY ("ownerId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bond_share" DROP CONSTRAINT "FK_19ee26b23edff5631e9fc649812"`, undefined);
        await queryRunner.query(`ALTER TABLE "bond_share" DROP CONSTRAINT "FK_5503cb15af3ea26b0eebb45bbe4"`, undefined);
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_ceca9f948aecebf0ae00f43b740"`, undefined);
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_04d0b17bc3974d4068b15831fd1"`, undefined);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "toId"`, undefined);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "fromId"`, undefined);
        await queryRunner.query(`ALTER TABLE "bond" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`, undefined);
        await queryRunner.query(`DROP TABLE "bond_share"`, undefined);
    }

}
