import { CafeteriaCategory } from "./cafeteria_category";

export class CafeteriaProduct {
  id: any;
  active: boolean;
  admissionProduct: boolean;
  branchStatusGroup: any;
  branches: any;
  cafeteriaCategory: CafeteriaCategory;
  cafeteriaStudentProduct: any;
  cost: number;
  countable: boolean;
  deleted: boolean;
  hasIngredient: boolean;
  ingredient: boolean;
  ingredients: any;
  productInfoHistorySet: any
  ingredientsOf: any;
  productUnitOfMeasure: any;
  productAdditionalParameterAnswerSet: any;
  type: any;
  variablePrice: boolean;
  price: number;
  name: string;
  productImg: string;

  constructor() {}
}
