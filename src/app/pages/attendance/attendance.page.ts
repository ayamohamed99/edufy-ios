import { Component, OnInit } from '@angular/core';
import {AccountService} from '../../services/Account/account.service';
import {AttendanceTeachersService} from '../../services/AttendanceTeachers/attendance-teachers.service';
import {TransFormDateService} from '../../services/TransFormDate/trans-form-date.service';
import {LoadingViewService} from '../../services/LoadingView/loading-view.service';
import _ from "lodash";
import * as dateFNS from "date-fns";

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.page.html',
  styleUrls: ['./attendance.page.scss'],
})
export class AttendancePage implements OnInit {

  TODAY_TAB = 'today';
  WEEKLY_TAB = 'weekly';
  MONTHLY_TAB = 'monthly';

  selectedTab;

  todayAttend:any = [];
  weeklyAttend:any = [];
  monthlyAttend:any = [];

  constructor(public accountServ:AccountService, public attendServ:AttendanceTeachersService,
              public tranDate:TransFormDateService,public load:LoadingViewService)
  {
    if(this.accountServ.getUserRole().attendanceAllTeachersAppear){
      this.selectedTab = this.TODAY_TAB;
    }else{
      this.selectedTab = this.WEEKLY_TAB;
    }
    this.getAttendanceDay()

  }

  ngOnInit() {

  }

  segmentChanged(ev){
    if(this.selectedTab == this.TODAY_TAB){
      this.getAttendanceDay();
    }else if(this.selectedTab == this.WEEKLY_TAB){
      this.getWeekAttendance();
    }else if(this.selectedTab == this.MONTHLY_TAB){
      this.getMonthAttendance();
    }
  }

  activeCheckInOneTeacherButton(){
    return true
  }

  activeCheckInTeachersButton(){
    return true
  }

  checkInNow(){
    console.log('checked in successfully')
  }

  getAttendanceDay(){

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
    }else if(this.selectedTab == this.WEEKLY_TAB){

    }

    //MARK: For toDate
    if(this.selectedTab == this.WEEKLY_TAB){

    }


    this.attendServ.getAllUserAttendanceToday(userId,from,to,false).subscribe(
        value => {

        },error1 => {

        });
  }



  getWeekAttendance(){

  }


  getMonthAttendance(){

      let userId = null;

      if(!this.accountServ.getUserRole().attendanceAllTeachersAppear){
          userId = this.accountServ.userId;
      }

    this.load.startLoading('',false,'loadingWithoutBackground').then(value => {
      this.attendServ.getAttendanceByOrder(this.accountServ.userBranchId, userId, true).subscribe(
          value => {
            // @ts-ignore
            let data:[any] = value;
            this.load.stopLoading().then(value1 => {
              data.forEach(
                  (val, index) => {
                    this.monthlyAttend = [];
                    this.monthlyAttend.push({'user':val[0], 'Attend':val[1], 'panlties':val[2], 'index':index+1});
                  });
            });

          },error1 => {
            this.load.stopLoading().then(value1 => {
              alert(error1.error);
            });
          });

    });
  }



}
