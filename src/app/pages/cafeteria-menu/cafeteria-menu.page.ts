import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  ReflectiveInjector,
} from "@angular/core";
import { CafeteriaService } from "src/app/services/Cafeteria/cafeteria.service";
import { LoadingViewService } from "src/app/services/LoadingView/loading-view.service";
import { CafeteriaCategory } from "src/app/models/cafeteria_category";
import { CafeteriaProduct } from "src/app/models/cafeteria_product";
import { CafeteriaOrder } from "src/app/models/cafeteria_order";
import {
  ActionSheetController,
  AlertController,
  IonSegment,
  ModalController,
} from "@ionic/angular";
import { DrawerState } from "ion-bottom-drawer";
import { CafeteriaCartViewPage } from "../cafeteria-cart-view/cafeteria-cart-view.page";

@Component({
  selector: "app-cafeteria-menu",
  templateUrl: "./cafeteria-menu.page.html",
  styleUrls: ["./cafeteria-menu.page.scss"],
})
export class CafeteriaMenuPage implements OnInit {
  categories: CafeteriaCategory[];
  selectedCategory: CafeteriaCategory;
  selectedCategoryIndex = "0";
  selectedCategoryProducts: CafeteriaProduct[];
  allProducts: CafeteriaProduct[];
  isSearching: boolean = false;

  searchInput = "";

  cart: Map<CafeteriaProduct, number>;
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
    private alertController: AlertController,
    private modalController: ModalController,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.getCategories();
    this.order = new CafeteriaOrder();
  }

  async getCategories() {
    this.load.startNormalLoading("Loading Products...");
    this.categories = await this.cafeteriaService.getCafeteriaProducts();
    this.selectedCategory = this.categories[0];
    this.selectedCategoryIndex = "0";
    this.selectedCategoryProducts = this.categories[0].products;
    this.load.stopLoading();
    this.cdRef.detectChanges();
    this.allProducts = new Array();
    for (let category of this.categories) {
      this.allProducts = this.allProducts.concat(category.products);
    }
    // Sort products ASC
    this.allProducts = this.allProducts.sort((product1, product2) =>
      product1.name.localeCompare(product2.name)
    );
  }

  segmentChanged(event: CustomEvent) {
    console.log("segmentChanged:", event);
    const index =
      event && event.detail && event.detail.value ? event.detail.value : 0;
    this.selectedCategory = this.categories[index];
    this.selectedCategoryIndex = "" + index;
    this.selectedCategoryProducts = this.categories[index].products;
  }

  addItem(product: CafeteriaProduct) {
    if (this.cart == null) {
      this.cart = new Map();
    }
    let count = 0;
    if (this.cart.get(product)) {
      count = this.cart.get(product);
    }
    this.cart.set(product, count + 1);
    this.total += product.price;
    this.count++;
  }

  async openCart() {
    const modal = await this.modalController.create({
      component: CafeteriaCartViewPage,
      componentProps: {
        cart: this.cart,
        count: this.count,
        total: this.total,
      },
    });

    modal.onDidDismiss().then((data) => {
      if (data && data.data) {
        this.cart = data.data.cart;
        if (data.data.comment) {
          this.order.comment = data.data.comment;
        }
        if (data.data.count) {
          this.count = data.data.count;
        }
        if (data.data.total) {
          this.total = data.data.total;
        }
        if (data.data.name == "orderPlaced") {
          this.placeOrder();
        }
      }
    });

    return await modal.present();
  }

  async placeOrder() {
    this.load.startNormalLoading("Placing Order...");
    const card = await this.cafeteriaService.getCafeteriaCard();
    if (card == null) {
      const alert = await this.alertController.create({
        // cssClass: 'my-custom-class',
        header: "Order cannot be placed",
        message:
          "You don't have a cafeteria card. Please contact your adminstration.",
        buttons: ["OK"],
      });
      this.load.stopLoading();
      await alert.present();
      return;
    }
    // TODO
    setTimeout(async () => {
      const alert = await this.alertController.create({
        // cssClass: 'my-custom-class',
        header: "Order Placed",
        message: "Your order is being prepared.",
        buttons: ["OK"],
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

  onSearchInput(event) {
    const val = event.target.value as string;
    console.log("onSearchInput" + val);
    this.searchInput = val;
    if (val && val.trim() != "") {
      if (!this.isSearching) {
        this.isSearching = true;
        this.selectedCategoryProducts = this.allProducts;
      }
      this.selectedCategoryProducts = this.allProducts.filter((product) =>
        product.name.toLocaleLowerCase().includes(val.toLocaleLowerCase())
      );
    }
  }

  onSearchCancel(event) {
    console.log("onSearchCancel");
    this.isSearching = false;
    this.selectedCategoryProducts = this.selectedCategory.products;
    this.searchInput = "";
  }

  // When searchbar loses focus
  onSearchBlur(event) {
    console.log("onSearchBlur", event);
    if (this.searchInput == "") {
      this.isSearching = false;
      this.selectedCategoryProducts = this.selectedCategory.products;
    }
  }
}
