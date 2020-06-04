import { Component, OnInit } from "@angular/core";
import { CafeteriaService } from "src/app/services/Cafeteria/cafeteria.service";
import { LoadingViewService } from "src/app/services/LoadingView/loading-view.service";
import { CafeteriaCard } from "src/app/models/cafeteria_card";
import { CafeteriaReceipt } from "src/app/models/cafeteria_receipt";
import { AccountService } from "src/app/services/Account/account.service";
import { CafeteriaRechargeHistory } from 'src/app/models/cafeteria_recharge_history';

@Component({
  selector: "app-cafeteria-card",
  templateUrl: "./cafeteria-card.page.html",
  styleUrls: ["./cafeteria-card.page.scss"],
})
export class CafeteriaCardPage implements OnInit {
  card: CafeteriaCard;
  history: CafeteriaRechargeHistory[];
  viewHistory = false;
  gettingHistory = false;
  cardExists = true;
  logo;

  constructor(
    private cafeteriaService: CafeteriaService,
    private accountservice: AccountService,
    private load: LoadingViewService
  ) {
    this.logo = this.accountservice.getAccountLogoUrl();
  }

  ngOnInit() {
    this.getCafeteriaCard();
  }

  async getCafeteriaCard() {
    this.load.startNormalLoading("Loading...");
    this.cardExists = true;
    this.card = await this.cafeteriaService.getCafeteriaCard();
    if (this.card == null) {
      this.cardExists = false;
    }
    this.load.stopLoading();
  }

  async viewStatement() {
    this.viewHistory = true;
    this.gettingHistory = true;
    this.history = await (await this.cafeteriaService.getStatement()).cafeteriaCardRechargeHistories;
    this.gettingHistory = false;
  }

  refresh() {
    this.getCafeteriaCard();
  }
}
