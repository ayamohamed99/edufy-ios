import { Injectable } from '@angular/core';
import {LoadingController} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingViewService {

  private load;

  constructor(private loadingCtrl:LoadingController) {}


  async startLoading(msg,trans:boolean, cssClass){
    this.load = await this.loadingCtrl.create({
      message: msg,
      translucent: trans,
      cssClass: cssClass
    });
    return await this.load.present();
  }

  async startNormalLoading(msg){
    this.load = await this.loadingCtrl.create({
      message: msg,
    });
    return await this.load.present();
  }

  async stopLoading(){
    return await this.load.dismiss()
  }
}
