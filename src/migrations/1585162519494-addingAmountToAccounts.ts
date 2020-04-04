import {MigrationInterface, QueryRunner} from "typeorm";

export class addingAmountToAccounts1585162519494 implements MigrationInterface {
    name = 'addingAmountToAccounts1585162519494'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" ADD "amount" integer NOT NULL default(0)`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "amount"`, undefined);
    }

}
