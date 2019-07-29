import {Component, OnInit, ViewChild} from '@angular/core';
import {AccountService} from '../../services/Account/account.service';
import {AttendanceTeachersService} from '../../services/AttendanceTeachers/attendance-teachers.service';
import {TransFormDateService} from '../../services/TransFormDate/trans-form-date.service';
import {LoadingViewService} from '../../services/LoadingView/loading-view.service';
import _ from "lodash";
import * as dateFNS from "date-fns";
import {Storage} from '@ionic/storage';
import {Network} from '@ionic-native/network/ngx';
import {load} from '@angular/core/src/render3';
import {AlertController, IonInfiniteScroll} from '@ionic/angular';

declare var wifiinformation: any;

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.page.html',
  styleUrls: ['./attendance.page.scss'],
})
export class AttendancePage implements OnInit {
    @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  localStorageAttendanceShift:string = 'LOCAL_STORAGE_USER_SHIFT';
  localStorageAttendanceWIFIS:string = 'LOCAL_STORAGE_USER_WIFIS';

  TODAY_TAB = 'today';
  WEEKLY_TAB = 'weekly';
  MONTHLY_TAB = 'monthly';

  selectedTab;

  todayAttend:any = [];
  todayAttendTempNull:any = [];
  weeklyAttend:any = [];
  weeklyAttendTempNull:any = [];
  weekDays;
  nextDayIndexInArray = 0;
  monthlyAttend:any = [];

  dateFormat = 'yyyy-MM-dd';

  userShiftData;
  checkIn = "CheckIn";
  wifi;
  connectedToSameWiFi = false;
  WIFI_CODE = 1;

  tempData;

  samePhone = false;

  constructor(public accountServ:AccountService, public attendServ:AttendanceTeachersService,
              public tranDate:TransFormDateService,public load:LoadingViewService,public alertController:AlertController,
              public storage:Storage, public network:Network)
  {
    if(this.accountServ.getUserRole().attendanceAllTeachersAppear){
      this.selectedTab = this.TODAY_TAB;
    }else{
      this.selectedTab = this.WEEKLY_TAB;
    }

    // this.storage.get(this.localStorageAttendanceShift).then(
    //     value => {
    //       let date = JSON.parse(value);
    //       if(this.checktheDateIn(date.checkInDate)) {
    //         this.userShiftData = JSON.parse(value);
    //       }
    //       if(this.userShiftData != null && this.checktheDateIn(date.checkInDate)){
    //         this.checkIn = "CheckOut";
    //       }
    //         if(this.userShiftData != null && this.checktheDateIn(date.checkInDate) && this.userShiftData.checkOutDate != null){
    //             this.checkIn = "";
    //         }
    //     },
    //     (err) => {})
    //     .catch((err) => {});

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

      this.checkTheAttendanceShift();
      if(this.selectedTab == this.WEEKLY_TAB){
          this.getAttendanceWeek();
      }
      if(this.selectedTab == this.TODAY_TAB){
          this.getTODAYData();
      }


      this.samePhone = this.attendServ.checkIfSameMobile(this.accountServ.userId);

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

  checkTheAttendanceShift(){

        let todat = this.tranDate.transformTheDate(new Date(), 'yyyy-MM-dd HH:mm');
        this.attendServ.getCheckUserAttendance(this.accountServ.userId, todat).subscribe(
            value => {
                console.log(value);
                this.userShiftData = value;
                if(this.userShiftData != null){

                    if(this.accountServ.getUserRole().checkInAttendance && this.accountServ.getUserRole().checkOutAttendance){
                        if(this.userShiftData.checkOutDate != null){
                            this.checkIn = "CheckIn"
                        }else if(this.userShiftData.checkOutDate == null){
                            this.checkIn = "CheckOut"
                        }
                    }else if(this.accountServ.getUserRole().checkInAttendance || this.accountServ.getUserRole().checkOutAttendance){
                        if(this.userShiftData.checkOutDate != null  && this.accountServ.getUserRole().checkInAttendance){
                            this.checkIn = "CheckIn"
                        }else if(this.userShiftData.checkOutDate == null && this.accountServ.getUserRole().checkOutAttendance){
                            this.checkIn = "CheckOut"
                        }else{
                            this.checkIn = ""
                        }
                    }else{
                        this.checkIn = ""
                    }


                }else{
                    this.checkIn = "CheckIn"
                }
            },error1 => {
                if(error1.error == 'This user has no attendance in this date'){

                }else{
                    this.presentAlert('Error', error1.error)
                }

            });
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
      if(this.samePhone){
          this.funcCheckIn();
      }else{
          this.presentChangePhoneAlert();
      }
  }

  funcCheckIn(){
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
                      if(this.accountServ.getUserRole().checkOutAttendance) {
                          this.checkIn = "CheckOut";
                      }else{
                          this.checkIn = "";
                      }
                      // this.storage.set(this.localStorageAttendanceShift, JSON.stringify(this.tempData));
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
        if(this.accountServ.getUserRole().checkInAttendance && this.network.type == 'wifi' && (this.userShiftData == null || this.userShiftData.checkOutDate != null)){
            return true;
        }else{
            return false;
        }
    }

  checkOutNow(){
        if(this.samePhone){
            this.funcCheckOut();
        }else{
            this.presentChangePhoneAlert();
        }
    }

  funcCheckOut(){
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
                      // this.storage.set(this.localStorageAttendanceShift, JSON.stringify(this.tempData));
                      this.userShiftData = this.tempData;
                      if(this.accountServ.getUserRole().checkInAttendance) {
                          this.checkIn = "CheckIn";
                      }else{
                          this.checkIn = "";
                      }
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

  async presentChangePhoneAlert() {
      const alert = await this.alertController.create({
          header: 'Alert',
          message: 'This phone not connect to your account do you want to change your phone and inform your admin?',
          buttons: [
              {
                  text: 'Cancel',
                  role: 'cancel',
                  handler: (blah) => {
                      console.log('Confirm Cancel: blah');
                  }
              }, {
                text: 'Okay',
                handler: () => {
                    this.attendServ.sentMobileMacAddress(this.accountServ.userId);
                }
              }]
      });
      await alert.present();
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
                                        'profileImg':val.profile_IMG,
                                        'name': val.name,
                                        'id': val.id
                                    });
                                }else{
                                    this.todayAttendTempNull.push({
                                        'checkout_DATE': val.checkout_DATE,
                                        'checkin_DATE': val.checkin_DATE,
                                        'shift_PENALTY_id': val.shift_PENALTY_id,
                                        'profileImg':val.profile_IMG,
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
                                    'profileImg':val.profile_IMG,
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

    let branchId;
    let userId;
    let from;
    let to;

    //MARK: For UserId
    if(!this.accountServ.getUserRole().attendanceAllTeachersAppear){
      userId = this.accountServ.userId;
        from = this.tranDate.getStartDateOfWeek(new Date(), 'yyyy-MM-dd HH:MM');
        to = this.tranDate.getEndDateOfWeek(new Date(), 'yyyy-MM-dd HH:MM');
    }else{

        branchId = this.accountServ.userBranchId;
        from = this.tranDate.getStartDateOfWeek(new Date(), 'yyyy-MM-dd HH:MM');
        let endDate = this.tranDate.getEndDateOfWeek(new Date(), 'yyyy-MM-dd HH:MM');
        this.nextDayIndexInArray = 0;
        this.weekDays = [];
        let daysOfWeek = this.tranDate.geteachDayOfWeek(from, endDate);
        daysOfWeek.forEach( value => {
            let date2 = this.tranDate.transformTheDate(value, 'yyyy-MM-dd');
            if(!this.tranDate.isFutureDate(date2)){
                this.weekDays.push(value);
            }
        });
    }

    this.load.startLoading('',false,'loadingWithoutBackground').then(value => {
        this.attendServ.getAllUserAttendanceTodayOrWeek(branchId, userId, from, to, false).subscribe(
            value => {
                // @ts-ignore
                let allData: [any] = value;
                this.load.stopLoading().then(val=> {
                    this.todayAttend = [];
                    this.weeklyAttend = [];
                    if(this.accountServ.getUserRole().attendanceAllTeachersAppear){
                        this.weeklyAttend.push({'isUser': false, 'header': from});
                        this.nextDayIndexInArray = this.nextDayIndexInArray + 1;
                        this.weeklyAttendTempNull = [];
                        if(this.infiniteScroll.disabled){
                            this.toggleInfiniteScroll();
                        }
                    }
                    allData.forEach(
                        (val, index) => {

                            if(this.selectedTab == this.TODAY_TAB) {
                                this.todayAttend.push({
                                    'checkOut_DATE':val.checkout_DATE,
                                    'checkin_DATE': val.checkin_DATE,
                                    'shift_PENALTY_id': val.shift_PENALTY_id,
                                    'profileImg':val.profile_IMG,
                                    'name': val.name,
                                    'id': val.id
                                });
                            }else{
                                if(!this.accountServ.getUserRole().attendanceAllTeachersAppear) {
                                    if(val.user.name){
                                        this.weeklyAttend.push({
                                            'checkInDate': val.checkin_DATE,
                                            'checkOutDate': val.checkout_DATE,
                                            'penaltyRules': val.shift_PENALTY_id,
                                            'profileImg':val.profile_IMG,
                                            'name': val.name,
                                            'id': val.id
                                        });
                                    }

                                }else{
                                    if(val.checkin_DATE) {
                                        this.weeklyAttend.push({
                                            'checkInDate': val.checkin_DATE,
                                            'checkOutDate': val.checkout_DATE,
                                            'penaltyRules': val.shift_PENALTY_id,
                                            'profileImg': val.profile_IMG,
                                            'name': val.name,
                                            'id': val.id,
                                            'isUser': true
                                        });
                                    }else{
                                        this.weeklyAttendTempNull.push({
                                            'checkInDate': val.checkin_DATE,
                                            'checkOutDate': val.checkout_DATE,
                                            'penaltyRules': val.shift_PENALTY_id,
                                            'profileImg': val.profile_IMG,
                                            'name': val.name,
                                            'id': val.id,
                                            'isUser': true
                                        });
                                    }
                                }
                            }
                        });

                    if(this.accountServ.getUserRole().attendanceAllTeachersAppear){
                        this.weeklyAttendTempNull.forEach(
                            (val, index)=>{
                                this.weeklyAttend.push({
                                    'checkInDate': val.checkin_DATE,
                                    'checkOutDate': val.checkout_DATE,
                                    'penaltyRules': val.shift_PENALTY_id,
                                    'profileImg': val.profile_IMG,
                                    'name': val.name,
                                    'id': val.id,
                                    'isUser': true
                                });
                            });
                    }

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

        let branchId = this.accountServ.userBranchId;
        let from = this.tranDate.transformTheDate(this.weekDays[this.nextDayIndexInArray], 'yyyy-MM-dd HH:MM');

        this.attendServ.getAllUserAttendanceTodayOrWeek(branchId, null, from, null, false).subscribe(
            value => {
                // @ts-ignore
                let allData: [any] = value;
                if(this.accountServ.getUserRole().attendanceAllTeachersAppear){
                    this.weeklyAttend.push({'isUser': false, 'header': from});
                    if(this.nextDayIndexInArray < (this.weekDays.length - 1)) {
                        this.nextDayIndexInArray = this.nextDayIndexInArray + 1;
                        // this.toggleInfiniteScroll();
                    }else if(this.nextDayIndexInArray >= (this.weekDays.length - 1)){
                        this.toggleInfiniteScroll();
                    }
                }
                this.weeklyAttendTempNull = [];
                allData.forEach(
                    (val, index) => {

                        if(val.checkin_DATE) {
                            this.weeklyAttend.push({
                                'checkInDate': val.checkin_DATE,
                                'checkOutDate': val.checkout_DATE,
                                'penaltyRules': val.shift_PENALTY_id,
                                'profileImg': val.profile_IMG,
                                'name': val.name,
                                'id': val.id,
                                'isUser': true
                            });
                        }else{
                            this.weeklyAttendTempNull.push({
                                'checkInDate': val.checkin_DATE,
                                'checkOutDate': val.checkout_DATE,
                                'penaltyRules': val.shift_PENALTY_id,
                                'profileImg': val.profile_IMG,
                                'name': val.name,
                                'id': val.id,
                                'isUser': true
                            });
                        }
                });

                this.weeklyAttendTempNull.forEach(
                    (val, index)=>{
                        this.weeklyAttend.push({
                            'checkInDate': val.checkin_DATE,
                            'checkOutDate': val.checkout_DATE,
                            'penaltyRules': val.shift_PENALTY_id,
                            'profileImg': val.profile_IMG,
                            'name': val.name,
                            'id': val.id,
                            'isUser': true
                        });
                    });

                ev.target.complete();

            }, error1 => {
                ev.target.complete();
                    alert(error1.error);
            });
    }

  toggleInfiniteScroll() {
        this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
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

  setDateFormat(date){
      let newFormat = this.tranDate.transformTheDate(new Date(date),'dd / MMM / yyyy');
      return newFormat
    }

  getColor(user){
      if(user.penaltyRules && user.checkInDate){
          return 'infoOneDivRed';
      }else if(!user.penaltyRules && user.checkInDate){
          return 'infoOneDiv';
      }else{
          return 'infoOneDivGray';
      }
    }

  getColorDay(user){
        if(user.shift_PENALTY_id && user.checkin_DATE){
            return 'infoOneDivRed';
        }else if(!user.shift_PENALTY_id && user.checkin_DATE){
            return 'infoOneDiv';
        }else{
            return 'infoOneDivGray';
        }
    }

  getColorMonth(user){
        if(user.Late > 5 && user.Attend > 0){
            return 'redColor';
        }else if(user.Late <= 5 && user.Late != 0 && user.Attend > 0){
            return 'greenColor';
        }else{
            return 'blueColor';
        }
    }

}
