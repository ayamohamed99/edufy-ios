import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CafeteriaProduct } from 'src/app/models/cafeteria_product';
import { CafeteriaService } from 'src/app/services/Cafeteria/cafeteria.service';

@Component({
  selector: "app-cafeteria-cart-view",
  templateUrl: "./cafeteria-cart-view.page.html",
  styleUrls: ["./cafeteria-cart-view.page.scss"],
})
export class CafeteriaCartViewPage implements OnInit {
  data;
  comment;
  @Input() cart: Map<CafeteriaProduct, number>;
  @Input() count: number;
  @Input() total: number;
  @Input() subTotal: number;
  @Input() discount: number;

  constructor(private modalController: ModalController, private cafeteriaService: CafeteriaService) {}

  ngOnInit() {}

  increment(product: CafeteriaProduct) {
    const count = this.cart.get(product);
    this.cart.set(product, count + 1);
    let productPrice = 0;
    if(!product.hasIngredient){
      productPrice = product.productInfoHistorySet[product.productInfoHistorySet.length -1].price;
    }else{
      productPrice = product.price;
    }
    this.subTotal += productPrice;
    this.total += this.cafeteriaService.calculateTotal(productPrice, this.discount, 0);
    this.count++;
  }

  decrement(product: CafeteriaProduct) {
    const count = this.cart.get(product);
    if (count == 1) {
      this.cart.delete(product);
    } else {
      this.cart.set(product, count - 1);
    }
    let productPrice = 0;
    if(!product.hasIngredient){
      productPrice = product.productInfoHistorySet[product.productInfoHistorySet.length -1].price;
    }else{
      productPrice = product.price;
    }
    this.subTotal -= productPrice;
    this.total -= this.cafeteriaService.calculateTotal(productPrice, this.discount, 0);

    this.count--;
  }

  placeOrder() {
    this.modalController.dismiss({
      name: "orderPlaced",
      cart: this.cart,
      comment: this.comment,
      count: this.count,
      total: this.total,
      subTotal: this.subTotal
    });
  }

  close() {
    this.modalController.dismiss({
      cart: this.cart,
      comment: this.comment,
      count: this.count,
      total: this.total,
      subTotal: this.subTotal
    });
  }
}
