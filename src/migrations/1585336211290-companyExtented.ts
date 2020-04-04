import {MigrationInterface, QueryRunner} from "typeorm";

export class companyExtented1585336211290 implements MigrationInterface {
    name = 'companyExtented1585336211290'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "name"`, undefined);
        await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "address"`, undefined);
        await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "taxId"`, undefined);
        await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "web"`, undefined);
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "amount"`, undefined);
        await queryRunner.query(`ALTER TABLE "company" ADD "orgType" character varying NOT NULL DEFAULT 'Public'`, undefined);
        await queryRunner.query(`ALTER TABLE "company" ADD "industry" character varying NOT NULL DEFAULT ''`, undefined);
        await queryRunner.query(`ALTER TABLE "company" ADD "founder" character varying NOT NULL DEFAULT '2020'`, undefined);
        await queryRunner.query(`ALTER TABLE "company" ADD "headquaters" character varying NOT NULL DEFAULT ''`, undefined);
        await queryRunner.query(`ALTER TABLE "company" ADD "numberOfEmployees" integer NOT NULL DEFAULT 0`, undefined);
        await queryRunner.query(`ALTER TABLE "company" ADD "product" character varying NOT NULL DEFAULT ''`, undefined);
        await queryRunner.query(`ALTER TABLE "company" ADD "revenue" character varying NOT NULL DEFAULT ''`, undefined);
        await queryRunner.query(`ALTER TABLE "company" ADD "website" character varying NOT NULL DEFAULT ''`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "website"`, undefined);
        await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "revenue"`, undefined);
        await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "product"`, undefined);
        await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "numberOfEmployees"`, undefined);
        await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "headquaters"`, undefined);
        await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "founder"`, undefined);
        await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "industry"`, undefined);
        await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "orgType"`, undefined);
        await queryRunner.query(`ALTER TABLE "account" ADD "amount" integer NOT NULL DEFAULT 0`, undefined);
        await queryRunner.query(`ALTER TABLE "company" ADD "web" character varying NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "company" ADD "taxId" character varying NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "company" ADD "address" character varying NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "company" ADD "name" character varying NOT NULL`, undefined);
    }

}
