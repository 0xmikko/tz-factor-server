import {MigrationInterface, QueryRunner} from "typeorm";

export class matureDateAdded1584656767273 implements MigrationInterface {
    name = 'matureDateAdded1584656767273'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bond" RENAME COLUMN "dateOfPayment" TO "matureDate"`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bond" RENAME COLUMN "matureDate" TO "dateOfPayment"`, undefined);
    }

}
