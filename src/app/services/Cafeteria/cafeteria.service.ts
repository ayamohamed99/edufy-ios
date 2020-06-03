import { Injectable } from "@angular/core";
import { AccountService } from "../Account/account.service";
import { HttpClient } from "@angular/common/http";
import { Url_domain } from "src/app/models/url_domain";
import { CafeteriaCategory } from "src/app/models/cafeteria_category";
import { CafeteriaCard } from "src/app/models/cafeteria_card";
import { CafeteriaReceipt } from "src/app/models/cafeteria_receipt";

@Injectable({
  providedIn: "root",
})
export class CafeteriaService {
  DomainUrl: Url_domain;

  constructor(
    private accountService: AccountService,
    private http: HttpClient
  ) {
    this.DomainUrl = new Url_domain();
  }

  getCafeteriaCategories() {
    return this.http.get(
      this.DomainUrl.Domain +
        "/authentication/CafeteriaPos.ent/getCafeteriaCategories.ent?branchId=" +
        this.accountService.userBranchId
    );
  }

  getCafeteriaCategoryProducts(categoryId) {
    return this.http.get(
      this.DomainUrl.Domain +
        "/authentication/CafeteriaPos.ent/getCafeteriaCategoryProducts.ent?categoryId=" +
        categoryId
    );
  }

  async getCafeteriaProducts() {
    const categories = (await this.getCafeteriaCategories().toPromise()) as any[];
    const promisesArray = [];
    for (let category of categories) {
      promisesArray.push(
        this.getCafeteriaCategoryProducts(category.id).toPromise()
      );
    }
    const result = await Promise.all(promisesArray);
    return result as CafeteriaCategory[];
  }

  placeOrder() {
    // TODO
    // return this.http.post(this.DomainUrl.Domain + "authentication/CafeteriaPos.ent/postCafeteriaReceipt.ent?isNew=true", null);
  }

  getCafeteriaCard(withHistory) {
    // TODO
    // return this.http.get(
    //   this.DomainUrl.Domain +
    //     "/authentication/student.ent/getStudentCafeteriaCard.ent?studentId=" +
    //     this.accountService.userId +
    //     "&withHistory=" +
    //     withHistory
    // );

    const card = new CafeteriaCard();
    card.id = 467;
    card.barCode = "99999999";
    card.credit = 150;
    card.discount = 25;
    card.branchId = this.accountService.userBranchId;

    return card;
  }

  getCafeteriaReceipts() {
    // TODO
    // return this.http.get(
    //   this.DomainUrl.Domain +
    //     "/authentication/student.ent/getStudentCafeteriaCard.ent?studentId=" +
    //     this.accountService.userId +
    //     "&withHistory=" +
    //     withHistory
    // );

    const receipts = new Array();
    const receipt1 = new CafeteriaReceipt();
    receipt1.creationDate = 1580135184000;
    receipt1.status = "PENDING";
    receipt1.discount = 25;
    receipt1.subTotal = 72;
    receipt1.total = 72;
    receipt1.products = [
      {
        id: 736,
        cost: 40,
        price: 80,
        quantity: 1,
        product: {
          id: 492,
          name: "pasta 2",
          price: 0,
          productImg: "",
        },
      },
    ];

    const receipt2 = new CafeteriaReceipt();
    receipt2.creationDate = 1580227357000;
    receipt2.deliveredDate = 1580229318000;
    receipt2.status = "COMPLETED";
    receipt2.discount = 25;
    receipt2.subTotal = 72.9;
    receipt2.total = 72.9;
    receipt2.products = [
      {
        id: 1026,
        cost: 1,
        price: 1,
        quantity: 1,
        product: {
          id: 557,
          name: "test 2",
          price: 0,
          productImg: "",
        },
      },
      {
        id: 1027,
        cost: 40,
        price: 80,
        quantity: 1,
        product: {
          id: 492,
          name: "pasta 2",
          price: 0,
          productImg: "",
        },
      },
    ];

    receipts.push(receipt1);
    receipts.push(receipt2);
    return receipts;
  }
}
