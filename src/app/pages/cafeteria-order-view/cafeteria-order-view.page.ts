import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CafeteriaReceipt } from 'src/app/models/cafeteria_receipt';

@Component({
  selector: "app-cafeteria-order-view",
  templateUrl: "./cafeteria-order-view.page.html",
  styleUrls: ["./cafeteria-order-view.page.scss"],
})
export class CafeteriaOrderViewPage implements OnInit {
  @Input() receipt: CafeteriaReceipt;
  @Input() numberOfItems: number;
  @Input() logo: string;

  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  close() {
    this.modalController.dismiss();
  }
}
