import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

type TransactionType = 'income' | 'outcome';

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: TransactionType;
}

interface TransactionResponse {
  transactions: Transaction[];
  balance: Balance;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): TransactionResponse {
    const transactionsResponse = {
      transactions: this.transactions,
      balance: this.getBalance(),
    };

    return transactionsResponse;
  }

  public getBalance(): Balance {
    const income = this.getSumOf('income');
    const outcome = this.getSumOf('outcome');
    const total = income - outcome;

    return {
      income,
      outcome,
      total,
    };
  }

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    const transaction = new Transaction({ title, value, type });

    this.transactions.push(transaction);

    return transaction;
  }

  private getSumOf(transactionType: TransactionType): number {
    if (!this.transactions.length) {
      return 0;
    }

    return this.transactions
      .filter(transaction => transaction.type === transactionType)
      .reduce((acc, cur) => acc + cur.value, 0);
  }
}

export default TransactionsRepository;
