import {MigrationInterface, QueryRunner} from "typeorm";

export class createdAt1584701635173 implements MigrationInterface {
    name = 'createdAt1584701635173'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bond" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bond" DROP COLUMN "createdAt"`, undefined);
    }

}
