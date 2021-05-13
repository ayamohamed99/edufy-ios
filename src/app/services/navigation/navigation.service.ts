import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private cafeteriaCartViewPage = null;

  constructor(private navCtrl: NavController) { }

  setCafeteriaCartViewPage(page) {
    this.cafeteriaCartViewPage = page;
  }

  getChargeGiftPage() {
    return this.cafeteriaCartViewPage;
  }
}
