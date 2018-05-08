import { Component } from '@angular/core';
import {
  AlertController, IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {NotificationNewPage} from "../notification-new/notification-new";



/**
 * Generated class for the NotificationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
})
export class NotificationPage {

  users:any =[];

  constructor(public navCtrl: NavController, public navParams: NavParams,private alrtCtrl:AlertController, private modalCtrl: ModalController) {
    this.users = ['ahmed','ahmed','ahmed','ahmed','ahmed','ahmed','ahmed','ahmed','ahmed','ahmed','ahmed','ahmed','ahmed','ahmed','ahmed','ahmed','ahmed','ahmed','ahmed','ahmed','ahmed','ahmed','ahmed','ahmed','ahmed','ahmed'];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationPage');
  }

  onSelectCard(index:any){
    this.alrtCtrl.create( {
      title: 'Card Number',
      subTitle: index,
      buttons: ['OK']
  }).present();
  }
  onOpenView() {
    let model = this.modalCtrl.create(NotificationNewPage);
    model.present();
  }

}
