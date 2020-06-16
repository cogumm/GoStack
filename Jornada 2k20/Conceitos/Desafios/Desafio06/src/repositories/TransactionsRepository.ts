import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    // TODO
    const transactions = await this.find();

    const [income, outcome] = transactions.reduce(
      (arr, transaction) => {
        if (transaction.type === 'income') {
          arr.splice(0, 1, arr[0] + Number(transaction.value));
        } else {
          arr.splice(1, 1, arr[1] + Number(transaction.value));
        }

        return arr;
      },
      [0, 0],
    );

    const total = income - outcome;

    const balance = {
      income,
      outcome,
      total,
    };

    return balance;
  }
}

export default TransactionsRepository;
