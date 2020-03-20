import {MigrationInterface, QueryRunner} from "typeorm";

export class userId1584690306305 implements MigrationInterface {
    name = 'userId1584690306305'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" ADD "userId" character varying NOT NULL`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "userId"`, undefined);
    }

}
