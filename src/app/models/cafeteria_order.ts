
import {CafeteriaProduct} from './cafeteria_product';

export class CafeteriaOrder {
  id: any;
  branchId: number;
  products: CafeteriaProduct[];
  comment: string;

  constructor() {}
}
