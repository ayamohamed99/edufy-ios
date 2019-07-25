import { Component, OnInit } from '@angular/core';
import {AttendanceTeachersService} from '../../services/AttendanceTeachers/attendance-teachers.service';
import {AccountService} from '../../services/Account/account.service';
import {LoadingViewService} from '../../services/LoadingView/loading-view.service';
import {AlertController, ModalController, ToastController} from '@ionic/angular';
import {Network} from '@ionic-native/network/ngx';
import {ToastViewService} from '../../services/ToastView/toast-view.service';
declare var WifiWizard2: any;


@Component({
  selector: 'app-attendance-wi-fi-edit',
  templateUrl: './attendance-wi-fi-edit.page.html',
  styleUrls: ['./attendance-wi-fi-edit.page.scss'],
})
export class AttendanceWiFiEditPage implements OnInit {

  wifiList:[any];
  attendData:[any];
  WIFI_CODE = 1;
  wifi;

  constructor(public accountServ:AccountService, public attend:AttendanceTeachersService, public load:LoadingViewService, public modal:ModalController, public alrt:AlertController, public network:Network, public toast:ToastViewService) {

    this.getAllAttendData();


    if(network.type == 'wifi'){


      WifiWizard2.requestPermission().then( (per) => {
        console.log('requestPermission' + per);
        this.wifi = {'ssid':'' ,'mac':''};
        WifiWizard2.getConnectedSSID().then( (ssid) => {
          console.log('SSID' + ssid);
          this.wifi.ssid = ssid;
        });

        WifiWizard2.getConnectedBSSID().then( (bssid) => {
          console.log('BSSID' + bssid);
          this.wifi.mac = bssid;
        });

      }).catch( (err) => {
        console.log('Error' + err);
      });



      // wifiinformation.getSampleInfo(wifi => {
      //     // alert(
      //     //     'SSID: ' + wifi.ssid +
      //     //     '\nMAC: ' + wifi.mac +
      //     //     '\nIP: ' + wifi.ip +
      //     //     '\nGateway: ' + wifi.gateway
      //     // );
      //
      //     this.wifi = wifi;
      //
      // }, (err) => console.error(err));
    }
  }

  ngOnInit() {
  }


  addThisWiFi(){


    let listUserBranch:[any] = this.accountServ.accountBranchesList;


    if(this.network.type == 'wifi') {
      if(listUserBranch.length > 1){
        let inputs = [{}];
        inputs.splice(0);
        listUserBranch.forEach(
            (val, index) => {
              if(index == 0){
                inputs.push({
                  name: 'radio',
                  type: 'radio',
                  label: val.name,
                  value: val.id,
                  checked: true
                });
              }else{
                inputs.push({
                  name: 'radio',
                  type: 'radio',
                  label: val.name,
                  value: val.id,
                });
              }
            });

        this.saveAttendForManyBranch(inputs);
      }else{
        this.saveAttentOneBranch();
      }
    }else {
      alert('Please Connect to any wifi to register it');
    }
  }

  async saveAttentOneBranch(){
    const alert = await this.alrt.create({
      header: 'Confirm!',
      message: 'Are you want to add <strong>'+ this.wifi.ssid+'</strong> to your attend wifi list?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            this.attend.addMethodData(this.accountServ.userBranchId,this.WIFI_CODE,JSON.stringify(this.wifi)).subscribe(
                value => {
                  this.toast.presentTimerToast('The WiFi Point save for your branch');
                },error1 => {
                  this.toast.presentTimerToast('Couldn\'t save the wifi point');
                });
          }
        }
      ]
    });

    await alert.present();
  }

  async saveAttendForManyBranch(data){
    const alerts = await this.alrt.create({
      header: 'Confirm!',
      message: 'Are you want to add <strong>'+ this.wifi.ssid+'</strong> to your attend wifi list?',
      inputs: data,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            // this.attend.addMethodData(this.accountServ.)
          }
        }
      ]
    });

    await alerts.present();
  }

  close(){
    this.modal.dismiss();
  }

  getAllAttendData(){
    this.load.startLoading('',false,'loadingWithoutBackground').then(value => {
      this.attend.getBranchAttendMeathodsData(this.accountServ.userBranchId,1).subscribe(
          next => {
            this.load.stopLoading();
            let data = next;
            // @ts-ignore
            this.attendData = data;

            this.wifiList = [{}];
            this.wifiList.splice(0);
            this.attendData.forEach(val => {
              let data = JSON.parse(val.methodData);
              if(val.methods.id == this.WIFI_CODE){
                this.wifiList.push({'data':val,'name':data.ssid});
              }
            });
          },err => {
            this.load.stopLoading();
          }
      )
    });
  }

  deleteItem(data){
    this.load.startLoading('',false,'loadingWithoutBackground').then(value => {

      this.attend.deleteMethodAttendData(data).subscribe(
        value => {
          this.load.stopLoading().then( val=>{
            this.getAllAttendData();
          });
        },error1 => {
            this.load.stopLoading().then( val=>{
              alert('Couldn\'t delete the wifi point');
            });
        });
    });
  }

}
