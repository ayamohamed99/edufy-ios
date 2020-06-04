import { CafeteriaRechargeHistory } from './cafeteria_recharge_history';

export class CafeteriaCard {
         id: number;
         branchId: number;
         barCode: string;
         credit: number;
         discount: number;
         receiptSet: any;
         cafeteriaCardRechargeHistories: CafeteriaRechargeHistory[];

         constructor() {}
       }
