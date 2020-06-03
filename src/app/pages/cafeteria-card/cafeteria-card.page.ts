import { Component, OnInit } from "@angular/core";
import { CafeteriaService } from 'src/app/services/Cafeteria/cafeteria.service';
import { LoadingViewService } from 'src/app/services/LoadingView/loading-view.service';
import { CafeteriaCard } from 'src/app/models/cafeteria_card';
import { CafeteriaReceipt } from 'src/app/models/cafeteria_receipt';

@Component({
  selector: "app-cafeteria-card",
  templateUrl: "./cafeteria-card.page.html",
  styleUrls: ["./cafeteria-card.page.scss"],
})
export class CafeteriaCardPage implements OnInit {
  card: CafeteriaCard;
  history: CafeteriaReceipt[];
  viewHistory = false;
  gettingHistory = false;

  constructor(
    private cafeteriaService: CafeteriaService,
    private load: LoadingViewService
  ) {}

  ngOnInit() {
    this.getCafeteriaCard();
  }

  async getCafeteriaCard() {
    // TODO
    // this.load.startNormalLoading("Loading...");
    this.card = await this.cafeteriaService.getCafeteriaCard(true);
    // this.history = await this.cafeteriaService.getStatment();
    // this.load.stopLoading();
  }

  viewStatment() {
    this.viewHistory = true;
    this.gettingHistory = true;
    // TODO
    setTimeout(() => {
      this.gettingHistory = false;
    }, 2000);
  }
}
