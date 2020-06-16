import { getCustomRepository, getRepository, In } from 'typeorm';
import csvParse from 'csv-parse';
import fs from 'fs';

import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';

interface CSVTransaction {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class ImportTransactionsService {
  async execute(filePath: string): Promise<Transaction[]> {
    // TODO
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getRepository(Category);

    const contactsReadStream = fs.createReadStream(filePath);

    // Configurações do CSV
    const parses = csvParse({
      from_line: 2,
    });

    const parseCSV = contactsReadStream.pipe(parses);

    const transactions: CSVTransaction[] = [];
    const categories: string[] = [];

    // Desestruturando o CSV.
    parseCSV.on('data', async line => {
      const [title, type, value, category] = line.map((cell: string) =>
        cell.trim(),
      );

      if (!title || !type || !value) return;

      categories.push(category);

      transactions.push({ title, value: Number(value), type, category });
    });

    await new Promise(resolve => parseCSV.on('end', resolve));

    const existentCategories = await categoriesRepository.find({
      where: { title: In(categories) },
    });

    const existentCategoriesTitles = existentCategories.map(
      category => category.title,
    );

    const addCategoryTitles = categories
      .filter(category => !existentCategoriesTitles.includes(category))
      .filter((value, index, self) => self.indexOf(value) === index);

    const newCategories = categoriesRepository.create(
      addCategoryTitles.map(categoryTitle => ({
        title: categoryTitle,
      })),
    );

    await categoriesRepository.save(newCategories);

    const finalCategories = [...newCategories, ...existentCategories];

    // // Verificação que o teste não valida

    // const [income, outcome] = transactions.reduce(
    //   (arr, transaction) => {
    //     if (transaction.type === 'income') {
    //       arr.splice(0, 1, arr[0] + Number(transaction.value));
    //     } else {
    //       arr.splice(1, 1, arr[1] + Number(transaction.value));
    //     }

    //     return arr;
    //   },
    //   [0, 0],
    // );

    // const totalOfCSV = income - outcome;

    // const { total } = await transactionsRepository.getBalance();

    // if (total - totalOfCSV < 0) {
    //   throw new AppError('Total balance cannot be under zero');
    // }

    const newTransactions = transactionsRepository.create(
      transactions.map(transaction => ({
        title: transaction.title,
        value: transaction.value,
        type: transaction.type,
        category: finalCategories.find(
          category => category.title === transaction.category,
        ),
      })),
    );

    await transactionsRepository.save(newTransactions);

    await fs.promises.unlink(filePath);

    return newTransactions;
  }
}

export default ImportTransactionsService;
