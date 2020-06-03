import { CafeteriaReceiptProduct } from './cafeteria_receipt_product';

export class CafeteriaReceipt {
  id: number;
  creationDate: number;
  deliveredDate: number;
  subTotal: number;
  tax: number;
  discount: number;
  total: number;
  status: string;
  products: CafeteriaReceiptProduct[];

  constructor() {}
}
