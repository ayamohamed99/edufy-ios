import { Component, OnInit } from '@angular/core';
import {AlertController, ModalController} from '@ionic/angular';
import {AttendanceTeachersService} from '../../services/AttendanceTeachers/attendance-teachers.service';
import {AccountService} from '../../services/Account/account.service';
import {LoadingViewService} from '../../services/LoadingView/loading-view.service';
import {ToastViewService} from '../../services/ToastView/toast-view.service';
import {TransFormDateService} from '../../services/TransFormDate/trans-form-date.service';

@Component({
  selector: 'app-phone-change-confirm',
  templateUrl: './phone-change-confirm.page.html',
  styleUrls: ['./phone-change-confirm.page.scss'],
})
export class PhoneChangeConfirmPage implements OnInit {

  phoneRequests = [];

  constructor(public modal:ModalController, public attendServec:AttendanceTeachersService, public accountServ:AccountService,
              public load:LoadingViewService,public alert:AlertController, public toast:ToastViewService, public transDate:TransFormDateService) {
    this.getAllDataRequestes();
  }

  close(){
    this.modal.dismiss();
  }

  ngOnInit() {
  }

  responceOnPhone(request, confirmation){


    this.load.startLoading('',false,'loadingWithoutBackground').then(value => {
      this.attendServec.responceOnRequest(request, confirmation).subscribe(
          value => {
            this.load.stopLoading().then( value1 => {
              this.toast.presentTimerToast('Phone Approved Successfully');
              this.getAllDataRequestes();
            });
          }, error1 => {
            this.load.stopLoading().then(value1 => {
              this.toast.presentTimerToast('Error! While approving the phone');
            });
          });
    });

  }

  getAllDataRequestes() {

    this.load.startLoading('',false,'loadingWithoutBackground').then(value => {
      this.attendServec.getAllPhoneRequestes(this.accountServ.userBranchId).subscribe(
          value => {
            let data = [];
            //@ts-ignore
            data = value;
            this.phoneRequests = data;
            this.load.stopLoading();
          }, error1 => {
            this.load.stopLoading().then(value1 => {
              this.presentAlertConfirm();
            });
          });
    });

  }

  formatDate(date){
    if(date){
      return this.transDate.transformTheDate(date, 'dd . MMM . yyyy  HH:mm');
    }else {
      return '';
    }
  }


  async presentAlertConfirm() {
    const alert = await this.alert.create({
      header: 'Error!',
      message: 'Can\'t connect to the server',
      buttons: [
        {
          text: 'Later',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Retry',
          handler: () => {
            this.getAllDataRequestes();
          }
        }
      ]
    });

    await alert.present();
  }

}
