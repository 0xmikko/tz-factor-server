import {MigrationInterface, QueryRunner} from "typeorm";

export class new1584558875363 implements MigrationInterface {
    name = 'new1584558875363'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "payment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "date" TIMESTAMP NOT NULL, "amount" integer NOT NULL, "status" character varying NOT NULL, "bondId" uuid, CONSTRAINT "PK_fcaec7df5adf9cac408c686b2ab" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "bond" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" integer NOT NULL, "dateOfPayment" TIMESTAMP NOT NULL, "issuerId" uuid, CONSTRAINT "PK_2a4d050cae7f0326222053ae2b4" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "company" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" character varying NOT NULL, "name" character varying NOT NULL, "address" character varying NOT NULL, "taxId" character varying NOT NULL, "web" character varying NOT NULL, CONSTRAINT "PK_056f7854a7afdba7cbd6d45fc20" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "account" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "companyId" uuid, CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "agreement" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "date" TIMESTAMP NOT NULL, CONSTRAINT "PK_e7537188219eeef56233a609753" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_8a17a80e7fb990eef447067822e" FOREIGN KEY ("bondId") REFERENCES "bond"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "bond" ADD CONSTRAINT "FK_123193815070e5ac721b8670749" FOREIGN KEY ("issuerId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "account" ADD CONSTRAINT "FK_2d01dcea17c1dbaa448a235ac57" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" DROP CONSTRAINT "FK_2d01dcea17c1dbaa448a235ac57"`, undefined);
        await queryRunner.query(`ALTER TABLE "bond" DROP CONSTRAINT "FK_123193815070e5ac721b8670749"`, undefined);
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_8a17a80e7fb990eef447067822e"`, undefined);
        await queryRunner.query(`DROP TABLE "agreement"`, undefined);
        await queryRunner.query(`DROP TABLE "account"`, undefined);
        await queryRunner.query(`DROP TABLE "company"`, undefined);
        await queryRunner.query(`DROP TABLE "bond"`, undefined);
        await queryRunner.query(`DROP TABLE "payment"`, undefined);
    }

}
