import { Component, OnInit } from '@angular/core';
import {AttendanceTeachersService} from '../../services/AttendanceTeachers/attendance-teachers.service';
import {AccountService} from '../../services/Account/account.service';
import {LoadingViewService} from '../../services/LoadingView/loading-view.service';
import {AlertController, ModalController, Platform, ToastController} from '@ionic/angular';
import {Network} from '@ionic-native/network/ngx';
import {ToastViewService} from '../../services/ToastView/toast-view.service';
import _ from "lodash";

declare var WifiWizard2: any;


@Component({
  selector: 'app-attendance-wi-fi-edit',
  templateUrl: './attendance-wi-fi-edit.page.html',
  styleUrls: ['./attendance-wi-fi-edit.page.scss'],
})
export class AttendanceWiFiEditPage implements OnInit {

  wifiList = [];
  // attendData:[any];
  WIFI_CODE = 1;
  wifi;
  otherWifiList;

  branchesList = [];
  selectedTab;


  constructor(public accountServ:AccountService, public attend:AttendanceTeachersService, public load:LoadingViewService,
              public modal:ModalController, public alrt:AlertController, public network:Network, public toast:ToastViewService,
              public platform:Platform) {

    this.branchesList = this.accountServ.accountBranchesList;

    this.selectedTab = this.branchesList[0].id;

    this.getAllAttendData(this.selectedTab);


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
    }

    network.onChange().subscribe(
        value => {

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

        });
  }

  scanWiFi(){
    if(this.network.type == 'wifi'){
          WifiWizard2.scan().then(
              val => {
                console.log(val);
                let temp = val;
                this.otherWifiList = [];
                temp.forEach( wiFi => {

                  if(!this.findWiFi(wiFi.BSSID)){
                    let wifiData = {'ssid':wiFi.SSID, 'mac':wiFi.BSSID};
                    this.otherWifiList.push(wifiData);
                  }
                });
              }).catch(
              err=>{
                console.log(err);
              });
    }
  }

  findWiFi(BSSID){

    let findWIFI = false;

    this.wifiList.forEach(wifi => {
      let data = JSON.parse(wifi.data.methodData);

      if(data.mac == BSSID){
        findWIFI = true;
      }

    });

    return findWIFI;
  }

  ngOnInit() {
  }

  tabThatSelectedDo(branchId){
    console.log(branchId);
    this.selectedTab = branchId;
    this.getAllAttendData(branchId);
  }

  addThisWiFi(wifi, branchId){

    if(this.network.type == 'wifi') {
        this.saveAttentOneBranch(wifi, branchId);
    }else {
      alert('Please Connect to any wifi to register it');
    }
  }

  async saveAttentOneBranch(wifi, branchId){
    const alert = await this.alrt.create({
      header: 'Confirm!',
      message: 'Are you sure you want to add <strong>'+ wifi.ssid+'</strong> to your wifi list?',
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
            this.attend.addMethodData(branchId,this.WIFI_CODE,JSON.stringify(wifi)).subscribe(
                value => {
                  this.getAllAttendData(this.selectedTab);
                  this.toast.presentTimerToast('The WiFi Point saved for your branch');
                },error1 => {
                  this.toast.presentTimerToast('Couldn\'t save the wifi point');
                });
          }
        }
      ]
    });

    await alert.present();
  }

  close(){
    this.modal.dismiss();
  }

  getAllAttendData(branchId){
    this.load.startLoading('',false,'loadingWithoutBackground').then(value => {
      this.attend.getBranchAttendMeathodsData(branchId,1).subscribe(
          next => {
            this.load.stopLoading();
            let attendData = [];
            //@ts-ignore
            attendData = next;

            this.wifiList = [];
            attendData.forEach(val => {
              let data = JSON.parse(val.methodData);
              if(val.methods.id == this.WIFI_CODE){
                this.wifiList.push({'data':val,'name':data.ssid});
              }
            });

            this.scanWiFi();
          },err => {
            this.load.stopLoading();
          }
      )
    });
  }

  async deleteItem(data){
     const alert = await this.alrt.create({
        header: 'Confirm!',
        message: 'Are you sure you want to delete this WiFi to your wifi list?',
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
              this.load.startLoading('',false,'loadingWithoutBackground').then(value => {

                this.attend.deleteMethodAttendData(data).subscribe(
                    value => {
                      this.load.stopLoading().then( val=>{
                        this.getAllAttendData(this.selectedTab);
                      });
                    },error1 => {
                      this.load.stopLoading().then( val=>{
                        if(error1.error.text == "DELETE_ATTENDANCE_DATA"){
                          this.getAllAttendData(this.selectedTab);
                        }else{
                          this.showAlert();
                        }
                      });
                    });
              });
            }
          }
        ]
      });

  }

  showAlert(){
    alert('Couldn\'t delete the wifi point');
  }

}
