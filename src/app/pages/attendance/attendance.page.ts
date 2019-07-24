import { Component, OnInit } from '@angular/core';
import {AccountService} from '../../services/Account/account.service';
import {AttendanceTeachersService} from '../../services/AttendanceTeachers/attendance-teachers.service';
import {TransFormDateService} from '../../services/TransFormDate/trans-form-date.service';
import {LoadingViewService} from '../../services/LoadingView/loading-view.service';
import _ from "lodash";
import * as dateFNS from "date-fns";
import {Storage} from '@ionic/storage';
import {Network} from '@ionic-native/network/ngx';
import {load} from '@angular/core/src/render3';
import {AlertController} from '@ionic/angular';

declare var wifiinformation: any;

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.page.html',
  styleUrls: ['./attendance.page.scss'],
})
export class AttendancePage implements OnInit {

  localStorageAttendanceShift:string = 'LOCAL_STORAGE_USER_SHIFT';
  localStorageAttendanceWIFIS:string = 'LOCAL_STORAGE_USER_WIFIS';

  TODAY_TAB = 'today';
  WEEKLY_TAB = 'weekly';
  MONTHLY_TAB = 'monthly';

  selectedTab;

  todayAttend:any = [];
    todayAttendTempNull:any = [];
  weeklyAttend:any = [];
  monthlyAttend:any = [];

  dateFormat = 'yyyy-MM-dd';

  userShiftData;
  checkIn = "CheckIn";
  wifi;
  connectedToSameWiFi = false;
    WIFI_CODE = 1;

    tempData;
  constructor(public accountServ:AccountService, public attendServ:AttendanceTeachersService,
              public tranDate:TransFormDateService,public load:LoadingViewService,public alertController:AlertController,
              public storage:Storage, public network:Network)
  {
    if(this.accountServ.getUserRole().attendanceAllTeachersAppear){
      this.selectedTab = this.TODAY_TAB;
    }else{
      this.selectedTab = this.WEEKLY_TAB;
    }

    this.storage.get(this.localStorageAttendanceShift).then(
        value => {
          let date = JSON.parse(value);
          if(this.checktheDateIn(date.checkInDate)) {
            this.userShiftData = JSON.parse(value);
          }
          if(this.userShiftData != null && this.checktheDateIn(date.checkInDate)){
            this.checkIn = "CheckOut";
          }
            if(this.userShiftData != null && this.checktheDateIn(date.checkInDate) && this.userShiftData.checkOutDate != null){
                this.checkIn = "";
            }
        },
        (err) => {})
        .catch((err) => {});

      this.storage.get(this.localStorageAttendanceWIFIS).then(
          value => {
              let date = JSON.parse(value);
              date.forEach(val => {
                  let data = JSON.parse(val.methodData);
                  if(val.methods.id == this.WIFI_CODE && (data.mac == this.wifi.mac)){
                      this.connectedToSameWiFi = true;
                  }
              });
          },
          (err) => {})
          .catch((err) => {});

    network.onchange().subscribe(
        value => {
          let val = value;

        }
    );
    if(network.type == 'wifi'){
      wifiinformation.getSampleInfo(wifi => {
        // alert(
        //     'SSID: ' + wifi.ssid +
        //     '\nMAC: ' + wifi.mac +
        //     '\nIP: ' + wifi.ip +
        //     '\nGateway: ' + wifi.gateway
        // );

        this.wifi = wifi;

      }, (err) => console.error(err));
    }
      if(this.selectedTab == this.WEEKLY_TAB){
          this.getAttendanceWeek();
      }
      if(this.selectedTab == this.TODAY_TAB){
          this.getTODAYData();
      }

  }

  checkContent(){
      if(this.checkIn == ""){
          return true;
      }else{
          return false;
      }
  }
  ngOnInit() {

  }
  segmentChanged(ev){
    if(this.selectedTab == this.TODAY_TAB){
      this.getTODAYData();
    }else if(this.selectedTab == this.WEEKLY_TAB){
      this.getAttendanceWeek();
    }else if(this.selectedTab == this.MONTHLY_TAB){
      this.getMonthAttendance();
    }
  }

  checktheDateIn(date){
    let savedShiftDate = this.tranDate.transformTheDate(new Date(date),"yyyy/MM/dd");
    let nowDate = this.tranDate.transformTheDate(new Date(),"yyyy/MM/dd");

    if(savedShiftDate == nowDate){
      return true;
    }else{
      return false;
    }
  }

  checkInNow(){

      if(this.network.type != 'wifi'){
          this.presentAlert('Alert','You need to connect to wifi');
      }else if(!this.connectedToSameWiFi){
          this.presentAlert('Alert','You need to connect to one of saved wifi');
      } else {

          let date = this.tranDate.transformTheDate(new Date(), "yyyy-MM-dd HH:mm");
          this.load.startLoading('', false, 'loadingWithoutBackground');

          this.attendServ.checkInAttendance(date, this.accountServ.userId).subscribe(
              value => {
                  this.tempData = value;
                  this.load.stopLoading().then(val=>{
                  this.checkIn = "CheckOut";
                  this.storage.set(this.localStorageAttendanceShift, JSON.stringify(this.tempData));
                      this.userShiftData = this.tempData;
                      if(this.selectedTab == this.WEEKLY_TAB){
                          this.getAttendanceWeek();
                      }
                      if(this.selectedTab == this.TODAY_TAB){
                          this.getTODAYData();
                      }
                  });
              }, error1 => {
                  this.load.stopLoading().then(value => {
                      this.presentAlert('Alert', error1.error);
                  });
              }
          );
      }
  }

    checkInCondition(){
        if(this.accountServ.getUserRole().checkInAttendance && this.network.type == 'wifi' && this.userShiftData == null && this.checkIn == "CheckIn"){
            return true;
        }else{
            return false;
        }
    }

    checkOutNow(){
        if(this.network.type != 'wifi'){
            this.presentAlert('Alert','You need to connect to wifi');
        }else if(!this.connectedToSameWiFi){
            this.presentAlert('Alert','You need to connect to one of saved wifi');
        } else {


            let date = this.tranDate.transformTheDate(new Date(), "yyyy-MM-dd HH:mm");
            this.load.startLoading('', false, 'loadingWithoutBackground');
            this.attendServ.checkOutAttendance(date, this.userShiftData).subscribe(
                value => {
                    this.tempData = value;
                    this.load.stopLoading().then(val=>{
                    this.storage.set(this.localStorageAttendanceShift, JSON.stringify(this.tempData));
                    this.userShiftData = this.tempData;
                    this.checkIn = "";
                    if(this.selectedTab == this.WEEKLY_TAB){
                        this.getAttendanceWeek();
                    }
                    if(this.selectedTab == this.TODAY_TAB){
                        this.getTODAYData();
                    }

                    });
                }, error1 => {
                    this.load.stopLoading().then(value => {
                        this.presentAlert('Alert', error1.error);
                    });
                }
            );
        }
    }

    checkOutCondition(){
      if(this.checkIn == "CheckOut" && this.accountServ.getUserRole().checkOutAttendance && this.network.type == 'wifi' && this.userShiftData != null && this.userShiftData.checkOutDate == null){
          return true;
      }else{
          return false;
      }
    }

    async presentAlert(head,msg) {
        const alert = await this.alertController.create({
            header: head,
            message: msg,
            buttons: ['OK']
        });

        await alert.present();
    }

    getTODAYData(){
        let userId;
        let from;
        let to;

        //MARK: For UserId
        if(!this.accountServ.getUserRole().attendanceAllTeachersAppear){
            userId = this.accountServ.userId;
        }


        //MARK: For fromDate
        if(this.selectedTab == this.TODAY_TAB){
            from = this.tranDate.transformTheDate(new Date(),'yyyy-MM-dd HH:mm');
        }

        this.load.startLoading('',false,'loadingWithoutBackground').then(value => {
            this.attendServ.getAllUserAttendanceWeek(this.accountServ.userBranchId,null, from, null, false).subscribe(
                value => {
                    // @ts-ignore
                    let allData: [any] = value;
                    this.load.stopLoading().then(val=> {
                        this.todayAttend = [];
                        this.todayAttendTempNull = [];
                        let lastDate = '';
                        allData.forEach(
                            (val, index) => {
                                if(val.checkin_DATE != null) {
                                    this.todayAttend.push({
                                        'checkout_DATE': val.checkout_DATE,
                                        'checkin_DATE': val.checkin_DATE,
                                        'shift_PENALTY_id': val.shift_PENALTY_id,
                                        'name': val.name,
                                        'id': val.id
                                    });
                                }else{
                                    this.todayAttendTempNull.push({
                                        'checkout_DATE': val.checkout_DATE,
                                        'checkin_DATE': val.checkin_DATE,
                                        'shift_PENALTY_id': val.shift_PENALTY_id,
                                        'name': val.name,
                                        'id': val.id
                                    });
                                }
                            });
                        this.todayAttendTempNull.forEach(
                            (val, index)=>{
                                this.todayAttend.push({
                                    'checkout_DATE': val.checkout_DATE,
                                    'checkin_DATE': val.checkin_DATE,
                                    'shift_PENALTY_id': val.shift_PENALTY_id,
                                    'name': val.name,
                                    'id': val.id
                                });
                            });
                    });

                }, error1 => {
                    this.load.stopLoading().then(val=> {
                        alert(error1.error);
                    });
                });
        });
    }

  getAttendanceWeek(){

    let userId;
    let from;
    let to;

    //MARK: For UserId
    if(!this.accountServ.getUserRole().attendanceAllTeachersAppear){
      userId = this.accountServ.userId;
    }


    //MARK: For fromDate
    if(this.selectedTab == this.TODAY_TAB){
      from = this.tranDate.transformTheDate(new Date(),'yyyy-MM-dd HH:mm');
    }

    if(this.selectedTab == this.WEEKLY_TAB){
        from = this.tranDate.getStartDateOfWeek(new Date(), 'yyyy-MM-dd HH:MM');
        to = this.tranDate.getEndDateOfWeek(new Date(), 'yyyy-MM-dd HH:MM');
    }

    this.load.startLoading('',false,'loadingWithoutBackground').then(value => {
        this.attendServ.getAllUserAttendanceTodayOrWeek(this.accountServ.userBranchId,userId, from, to, false).subscribe(
            value => {
                // @ts-ignore
                let allData: [any] = value;
                this.load.stopLoading().then(val=> {
                    this.todayAttend = [];
                    this.weeklyAttend = [];
                    let lastDate = '';
                    allData.forEach(
                        (val, index) => {

                            if(this.selectedTab == this.TODAY_TAB) {
                                this.todayAttend.push({
                                    'checkInDate': val.checkInDate,
                                    'checkOutDate': val.checkOutDate,
                                    'penaltyRules': val.penaltyRules,
                                    'user': val.user,
                                    'workShifts': val.workShifts
                                });
                            }else{
                                if(!this.accountServ.getUserRole().attendanceAllTeachersAppear) {
                                    this.weeklyAttend.push({
                                        'checkInDate': val.checkInDate,
                                        'checkOutDate': val.checkOutDate,
                                        'penaltyRules': val.penaltyRules,
                                        'user': val.user,
                                        'workShifts': val.workShifts
                                    });
                                }else{
                                    let date = this.getDateOnly(val.checkInDate);
                                    if(date != lastDate){
                                        this.weeklyAttend.push({'isUser': false, 'header': date});
                                        lastDate = date;
                                    }

                                    this.weeklyAttend.push({
                                        'checkInDate': val.checkInDate,
                                        'checkOutDate': val.checkOutDate,
                                        'penaltyRules': val.penaltyRules,
                                        'user': val.user,
                                        'workShifts': val.workShifts,
                                        'isUser': true
                                    });
                                }
                            }
                        });
                });

            }, error1 => {
                this.load.stopLoading().then(val=> {
                    alert(error1.error);
                });
            });
    });
  }


  getTime(date){
    if(date){
      return this.tranDate.transformTheDate(new Date(date), 'HH:mm');
    }else{
      return ''
    }

  }

  getMonthAttendance(){

      let userId = null;
      let branchId = this.accountServ.userBranchId;
      if(!this.accountServ.getUserRole().attendanceAllTeachersAppear){
          userId = this.accountServ.userId;
          branchId = null;
      }

    this.load.startLoading('',false,'loadingWithoutBackground').then(value => {
      this.attendServ.getAttendanceByOrder(branchId, userId, true).subscribe(
          value => {
            // @ts-ignore
            let data:[any] = value;
            this.load.stopLoading().then(value1 => {
              this.monthlyAttend = [];
              data.forEach(
                  (val, index) => {
                    this.monthlyAttend.push({'id':val[0], 'name':val[1], 'profileImg':val[2],'Attend':val[3], 'Late':val[4] ,'index':index+1});
                  });
            });

          },error1 => {
            this.load.stopLoading().then(value1 => {
              alert(error1.error);
            });
          });

    });
  }

    loadData(ev){

    }
    getFristName(name){
        let arr = name.split(" ");
        return arr[0];
    }

    getlastName(name){
        let arr = name.split(" ");
        return arr[1];
    }

    getDateOnly(date){
        return this.tranDate.transformTheDate(new Date(date),'dd/MM/yyyy');
    }

    getDay(date){
       let D = this.tranDate.transformTheDate(new Date(date),'yyyy-MM-dd');
       let arrD = D.split('-');
       return arrD[2];
    }

    getMonth(date){
        let M = this.tranDate.transformTheDate(new Date(date),'yyyy-MMM-dd');
        let arrM = M.split('-');
        return arrM[1];
    }

}
