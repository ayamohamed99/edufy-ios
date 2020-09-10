import { CafeteriaReceipt } from './cafeteria_receipt';

export class CafeteriaRechargeHistory {
  id: number;
  amount: number;
  creationDate: number;
  newCredit: number;
  receipt: CafeteriaReceipt;
  status: string;

  constructor() {}
}
