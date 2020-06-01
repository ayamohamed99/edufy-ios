import { Component, OnInit } from "@angular/core";
import { CafeteriaService } from "src/app/services/Cafeteria/cafeteria.service";
import { LoadingViewService } from "src/app/services/LoadingView/loading-view.service";
import { CafeteriaCategory } from "src/app/models/cafeteria_category";
import { CafeteriaProduct } from 'src/app/models/cafeteria_product';
import { CafeteriaOrder } from 'src/app/models/cafeteria_order';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { DrawerState } from 'ion-bottom-drawer';

@Component({
  selector: "app-cafeteria-menu",
  templateUrl: "./cafeteria-menu.page.html",
  styleUrls: ["./cafeteria-menu.page.scss"],
})
export class CafeteriaMenuPage implements OnInit {
  categories: CafeteriaCategory[];
  selectedCategory: CafeteriaCategory;
  isSearching: boolean = false;
  
  cart: Map<CafeteriaProduct,number>;
  total: number = 0.0;
  count: number = 0.0;
  drawerState = DrawerState.Docked;
  distanceTop = 20;
  minimumHeight = 56;
  dockedHeight = 56;

  order: CafeteriaOrder;

  constructor(
    private cafeteriaService: CafeteriaService,
    private load: LoadingViewService,
    public actionSheetController: ActionSheetController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.getCategories();
    this.order = new CafeteriaOrder();
  }

  async getCategories() {
    this.load.startNormalLoading("Loading Products...");
    this.categories = await this.cafeteriaService.getCafeteriaProducts();
    this.selectedCategory = this.categories[0];
    this.load.stopLoading();
  }

  segmentChanged(index) {
    console.log("segmentChanged:", event);
    this.selectedCategory = this.categories[index];
  }

  addItem(product: CafeteriaProduct){
    if(this.cart == null) {
      this.cart = new Map();
    }
    let count = 0;
    if(this.cart.get(product)) {
      count = this.cart.get(product);
    }
    this.cart.set(product, count+1);
    this.total += product.price;
    this.count++;
  }

  increment(product: CafeteriaProduct){
    const count = this.cart.get(product);
    this.cart.set(product, count+1);
    this.total += product.price;
    this.count++;
  }

  decrement(product: CafeteriaProduct){
    const count = this.cart.get(product);
    if (count == 1){
      this.cart.delete(product);
    } else {
    this.cart.set(product, count-1);
    }
    this.total -= product.price;
    this.count--;
  }

  openCart() {
    this.drawerState = DrawerState.Top;
  }

  closeCart() {
    this.drawerState = DrawerState.Docked;
  }

  placeOrder() {
    this.closeCart();
    this.load.startNormalLoading("Placing Order...");
    // TODO
    setTimeout(async() => {
      const alert = await this.alertController.create({
        // cssClass: 'my-custom-class',
        header: 'Order Placed',
        message: 'Your order is being prepared.',
        buttons: ['OK']
      });
      this.load.stopLoading();
      await alert.present();
    this.emptyCart();
    }, 2000);
  }

  emptyCart() {
    this.cart.clear();
    this.total = 0.0;
    this.count = 0.0;
  }

  onSearchInput(event){
    // set val to the value of the searchbar
    const val = event.target.value;
    console.log('onSearchInput'+val);

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
    }
  }

  onSearchCancel(event){
    const val = event.target.value;
    console.log('onSearchCancel'+val);
  }

  
  onSearchFocus(event){
    const val = event.target.value;
    console.log('onSearchFocus'+val);
  }
}
