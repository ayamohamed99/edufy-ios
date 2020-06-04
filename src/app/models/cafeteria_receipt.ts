import { CafeteriaReceiptProduct } from './cafeteria_receipt_product';

export class CafeteriaReceipt {
         id: number;
         branchId: number;
         creationDate: number;
         deliveredDate: number;
         subTotal: number;
         tax: number;
         discount: number;
         total: number;
         status: string;
         products: CafeteriaReceiptProduct[];
         receiptHistory: any;

         constructor() {}
       }
