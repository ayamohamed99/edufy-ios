
import {CafeteriaProduct} from './cafeteria_product';
import { CafeteriaCard } from './cafeteria_card';

export class CafeteriaOrder {
  id: any;
  card: CafeteriaCard;
  creationDate: number;
  discount: number;
  branchId: number;
  status: string;
  total: number;
  subTotal: number;
  tax: number;
  user: any;
  products: CafeteriaProduct[];
  comment: string;

  constructor() {}
}
