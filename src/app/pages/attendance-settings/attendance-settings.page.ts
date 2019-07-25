import { Component, OnInit } from '@angular/core';
import {AccountService} from '../../services/Account/account.service';
import {ModalController} from '@ionic/angular';
import {AttendanceWiFiEditPage} from '../attendance-wi-fi-edit/attendance-wi-fi-edit.page';

@Component({
  selector: 'app-attendance-settings',
  templateUrl: './attendance-settings.page.html',
  styleUrls: ['./attendance-settings.page.scss'],
})
export class AttendanceSettingsPage implements OnInit {


  WIFI_ID = 1;


  constructor(public accountServ:AccountService, public modalCtrl:ModalController) {

  }

  ngOnInit() {
  }

  selectedItem(id){
    if(id == this.WIFI_ID){
      this.presentEditWiFiModal()
    }
  }


  async presentEditWiFiModal() {

    const eModal = await this.modalCtrl.create({
      component: AttendanceWiFiEditPage,
    });

    eModal.onDidDismiss().then( data => {

    });

    return await eModal.present();
  }

}
