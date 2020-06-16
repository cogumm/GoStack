import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class AddCategoryIdToTransactions1592330390398
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'transactions',
      new TableColumn({
        name: 'category_id',
        type: 'uuid',
        isNullable: true,
      }),
    );

    const foreignKey = new TableForeignKey({
      columnNames: ['category_id'],
      referencedColumnNames: ['id'],
      referencedTableName: 'categories',
      name: 'TransactionCategory',
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    await queryRunner.createForeignKey('transactions', foreignKey);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('transactions', 'TransactionCategory');

    await queryRunner.dropColumn('transactions', 'category_id');
  }
}
