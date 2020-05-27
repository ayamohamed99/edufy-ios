import { Component, OnInit } from '@angular/core';
import {AccountService} from '../../services/Account/account.service';
import {ModalController} from '@ionic/angular';
import {AttendanceWiFiEditPage} from '../attendance-wi-fi-edit/attendance-wi-fi-edit.page';
import {PhoneChangeConfirmPage} from '../phone-change-confirm/phone-change-confirm.page';

@Component({
  selector: 'app-attendance-settings',
  templateUrl: './attendance-settings.page.html',
  styleUrls: ['./attendance-settings.page.scss'],
})
export class AttendanceSettingsPage implements OnInit {


  WIFI_ID = 1;
  PHONE_CHANGE = 2;

  constructor(public accountServ:AccountService, public modalCtrl:ModalController) {

  }

  ngOnInit() {
  }

  selectedItem(id){
    if(id == this.WIFI_ID){
      this.presentEditWiFiModal()
    }
    if(id == this.PHONE_CHANGE){
      this.presentPhoneChangeComfimationModal();
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

  async presentPhoneChangeComfimationModal() {

    const eModal = await this.modalCtrl.create({
      component: PhoneChangeConfirmPage,
    });

    eModal.onDidDismiss().then( data => {

    });

    return await eModal.present();
  }

}
