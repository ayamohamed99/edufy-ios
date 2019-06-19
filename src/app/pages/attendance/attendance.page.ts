import { Component, OnInit } from '@angular/core';

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
  onePerson:boolean = true;

  absent = true;
  constructor()
  {
    if(!this.onePerson){
      this.selectedTab = this.TODAY_TAB;
    }else{
      this.selectedTab = this.WEEKLY_TAB;
    }

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



}
