import { Component, OnInit } from '@angular/core';
import { CafeteriaService } from 'src/app/services/Cafeteria/cafeteria.service';
import { LoadingViewService } from 'src/app/services/LoadingView/loading-view.service';
import { CafeteriaCategory } from 'src/app/models/cafeteria_category';

@Component({
  selector: "app-cafeteria-products",
  templateUrl: "./cafeteria-products.page.html",
  styleUrls: ["./cafeteria-products.page.scss"],
})
export class CafeteriaProductsPage implements OnInit {
  categories: CafeteriaCategory[];
  selectedCategory: CafeteriaCategory;
  constructor(
    private cafeteriaService: CafeteriaService,
    private load: LoadingViewService
  ) {}

  ngOnInit() {
    this.getCategories();
  }

  async getCategories() {
    this.load.startNormalLoading("Loading Products...");
    this.categories = await this.cafeteriaService.getCafeteriaProducts();
    this.selectedCategory = this.categories[0];
    this.load.stopLoading();
  }

  segmentChanged(index){
    console.log("segmentChanged:", event);
    this.selectedCategory = this.categories[index];
  }
}
