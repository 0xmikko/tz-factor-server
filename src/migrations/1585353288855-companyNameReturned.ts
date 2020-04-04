import {MigrationInterface, QueryRunner} from "typeorm";

export class companyNameReturned1585353288855 implements MigrationInterface {
    name = 'companyNameReturned1585353288855'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "company" ADD "name" character varying NOT NULL DEFAULT ''`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "name"`, undefined);
    }

}
