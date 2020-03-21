import {MigrationInterface, QueryRunner} from "typeorm";

export class removeUserIdFromAccount1584714619858 implements MigrationInterface {
    name = 'removeUserIdFromAccount1584714619858'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "userId"`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" ADD "userId" character varying NOT NULL`, undefined);
    }

}
