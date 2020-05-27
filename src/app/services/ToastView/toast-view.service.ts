import { Injectable } from '@angular/core';
import {ToastController} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastViewService {
  private toast;
  constructor(private toastController:ToastController) { }

  async presentTimerToast(msg) {
    this.toast = await this.toastController.create({
      message: msg,
      duration: 3000
    });
    return await this.toast.present();
  }

  async presentPositionToast(msg,position) {
    this.toast = await this.toastController.create({
      message: msg,
      duration: 3000,
      position: position
    });
    return await this.toast.present();
  }

  async toastDismiss(){
    return await this.toast.dismiss();
  }

}
