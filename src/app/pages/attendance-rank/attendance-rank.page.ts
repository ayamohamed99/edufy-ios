import { Component, OnInit } from '@angular/core';
import {AttendanceTeachersService} from '../../services/AttendanceTeachers/attendance-teachers.service';
import {AccountService} from '../../services/Account/account.service';
import _ from "lodash";
import {LoadingViewService} from '../../services/LoadingView/loading-view.service';

@Component({
  selector: 'app-attendance-rank',
  templateUrl: './attendance-rank.page.html',
  styleUrls: ['./attendance-rank.page.scss'],
})
export class AttendanceRankPage implements OnInit {

  Rank1;
  Rank2;
  Rank3;
  allOtherRanks:any = [];

  allData:any = [];

  constructor(public attendServ:AttendanceTeachersService, public accountServ:AccountService, public load:LoadingViewService) {
   // this.getUsersByRanks();
  }

  ngOnInit() {
    this.getUsersByRanks();
  }


  getUsersByRanks(){
    this.load.startLoading('',false,'loadingWithoutBackground').then(value => {

        let bId = this.accountServ.userBranchId;
    this.attendServ.getAttendanceByOrder(bId, null, false).subscribe(
        value => {
          // @ts-ignore
          this.allData = value;
          this.load.stopLoading().then(value1 => {
            this.allOtherRanks = [];
            this.allData.forEach(
                (val, index) => {
                  if(index == 0){
                    this.Rank1 = {'id':val[0], 'name':val[1], 'profileImg':val[2],'Attend':val[3], 'Late':val[4] ,'index':index+1};
                  }
                  else if(index == 1){
                    this.Rank2 = {'id':val[0], 'name':val[1], 'profileImg':val[2],'Attend':val[3], 'Late':val[4] ,'index':index+1};
                  }
                  else if(index == 2){
                    this.Rank3 = {'id':val[0], 'name':val[1], 'profileImg':val[2],'Attend':val[3], 'Late':val[4] ,'index':index+1};
                  }else{
                    this.allOtherRanks.push({'id':val[0], 'name':val[1], 'profileImg':val[2],'Attend':val[3], 'Late':val[4] ,'index':index+1});
                  }

                });
          });

        },error1 => {
          this.load.stopLoading().then(value1 => {
            alert(error1.error);
          });
        });

    });
  }

  getFristName(name){
    let arr = name.split(" ");
    return arr[0];
  }

  getlastName(name){
    let arr = name.split(" ");
    return arr[1];
  }

}
