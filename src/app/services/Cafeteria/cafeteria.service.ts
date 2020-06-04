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

  async getCafeteriaCard() {
    const card = await this.http
      .get(
        this.DomainUrl.Domain +
          "/authentication/user.ent/getUserCafeteriaCard.ent?userId=" +
          this.accountService.userId +
          "&withHistory=" +
          false
      )
      .toPromise()
      .then((res) => {
        return res;
      })
      .catch((error) => {
        console.error("getCafeteriaCard", error);
        return null;
      });

    // const card = new CafeteriaCard();
    // card.id = 467;
    // card.barCode = "99999999";
    // card.credit = 150;
    // card.discount = 25;
    // card.branchId = this.accountService.userBranchId;

    return card as CafeteriaCard;
  }

  async getStatment() {
    const result = await this.http
      .get(
        this.DomainUrl.Domain +
          "/authentication/user.ent/getUserCafeteriaCard.ent?userId=" +
          this.accountService.userId +
          "&withHistory=" +
          true
      )
      .toPromise()
      .then((res) => {
        return res;
      })
      .catch((error) => {
        console.error("getCafeteriaCard", error);
        return null;
      });
    return result;
  }
}
