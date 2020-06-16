import { getCustomRepository } from 'typeorm';
import { isUuid } from 'uuidv4';

import AppError from '../errors/AppError';

import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    // TODO
    if (!isUuid(id)) {
      throw new AppError('Invalid ID to transaction');
    }

    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const transactionFound = await transactionsRepository.findOne(id);

    if (!transactionFound) {
      throw new AppError(
        'Transaction does not exists, did you already delete it?',
        404,
      );
    }

    await transactionsRepository.remove(transactionFound);
  }
}

export default DeleteTransactionService;
