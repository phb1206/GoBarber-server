import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export default class CreateRelationAppointmentsUser1612713314809
    implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createForeignKey(
            'appointments',
            new TableForeignKey({
                name: 'FK_appintments_users',
                columnNames: ['provider_id'],
                referencedTableName: 'users',
                referencedColumnNames: ['id'],
                onDelete: 'SET NULL',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey(
            'appointments',
            'FK_appintments_users',
        );
    }
}
