import { Component, OnInit } from '@angular/core';
import {AccountService} from '../../services/Account/account.service';
import {AttendanceTeachersService} from '../../services/AttendanceTeachers/attendance-teachers.service';
import {TransFormDateService} from '../../services/TransFormDate/trans-form-date.service';

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
  // onePerson:boolean = true;

  absent = true;
  constructor(public accountServ:AccountService, public attendServ:AttendanceTeachersService, public tranDate:TransFormDateService)
  {
    if(this.accountServ.getUserRole().attendanceAllTeachersAppear){
      this.selectedTab = this.TODAY_TAB;
    }else{
      this.selectedTab = this.WEEKLY_TAB;
    }

    this.getAttendance()

  }

  ngOnInit() {

  }

  segmentChanged(ev){

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

  getAttendance(){

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

    }else if(this.selectedTab == this.MONTHLY_TAB){

    }

    //MARK: For toDate
    if(this.selectedTab == this.WEEKLY_TAB){

    }else if(this.selectedTab == this.MONTHLY_TAB){

    }


    this.attendServ.getAllUserAttendanceByDate(userId,from,to).subscribe(
        value => {

        },error1 => {

        });
  }

}
