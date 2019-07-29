import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Url_domain} from '../../models/url_domain';
import {AttendanceData} from '../../models/attendance_data';
import {Device} from '@ionic-native/device/ngx';

@Injectable({
  providedIn: 'root'
})
export class AttendanceTeachersService {


  DomainUrl: Url_domain = new Url_domain;

  httpOptions;

  private deviceInfo = {};
  private LOGIN_WITH_SAME_PHONE = false;

  constructor(private http: HttpClient, public device:Device) {}

  putHeader(value) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'content-type': 'application/json',
        Authorization: value
      })
    };
  }

  getBranchAttendMeathods(branchId) {
    return this.http.get(this.DomainUrl.Domain + '/authentication/attendanceTeachers.ent/getBranchAttendMethods.ent?branchId='+branchId);
  }

  getBranchAttendMeathodsData(branchId,methodId) {

    let url = this.DomainUrl.Domain + '/authentication/attendanceTeachers.ent/getBranchMethodsData.ent?branchId='+branchId;

    if(methodId){
      url += '&method='+methodId
    }

    return this.http.get(url);
  }

  addMethodData(branchId,methodId,data){
    let attendTemp = {
      'branch':{'id':branchId},
      'methods':{'id':methodId},
      'methodData':data
    };
    return this.http.post(this.DomainUrl.Domain + '/authentication/attendanceTeachers.ent/addBranchMethodsData.ent',attendTemp);
  }

  deleteMethodAttendData(selectedData){
    // let data = {
    //   'id':selectedData.id,
    //   'branch':{'id':selectedData.branch},
    //   'methods':{'id':selectedData.methods},
    //   'methodData':selectedData.methodData
    // };
    return this.http.post(this.DomainUrl.Domain + '/authentication/attendanceTeachers.ent/deleteBranchMethodsData.ent',selectedData,this.httpOptions);
  }

  updateBranchAttendData(selectedData){
    return this.http.put(this.DomainUrl.Domain + '/authentication/attendanceTeachers.ent/updateBranchMethodsData.ent.ent',selectedData);
  }


  checkInAttendance(date,userId){
    return this.http.post(this.DomainUrl.Domain + '/authentication/userAttendance.ent/postAttendanceCheckIn.ent?checkInDate='+date, {'id':userId}, this.httpOptions);
  }

  checkOutAttendance(date,userAttentOp){
    return this.http.post(this.DomainUrl.Domain + '/authentication/userAttendance.ent/postAttendanceCheckOut.ent?checkOutDate='+date, userAttentOp, this.httpOptions);
  }


  getAllUserAttendanceTodayOrWeek(branchId, userId, fromDate, toDate,isOrderedByName){
    let url = this.DomainUrl.Domain + '/authentication/userAttendance.ent/getWeekAttendance.ent?fromDate='+fromDate;

    if(toDate){
      url += '&toDate=' + toDate;
    }
    if(userId){
      url += '&userId=' + userId;
    }

    if(branchId){
        url += '&branchId=' + branchId;
    }

    url += '&ordered=' + isOrderedByName;
    return this.http.get(url);
  }

    getAllUserAttendanceWeek(branchId, userId, fromDate, toDate,isOrderedByName){
        let url = this.DomainUrl.Domain + '/authentication/userAttendance.ent/getAllUserAttendanceByAttribute.ent?fromDate='+fromDate;

        if(toDate){
            url += '&toDate=' + toDate;
        }
        if(userId){
            url += '&userId=' + userId;
        }

      if(branchId){
        url += '&branchId=' + branchId;
      }

        url += '&ordered=' + isOrderedByName;
        return this.http.get(url);
    }

  getAttendanceByOrder(branchId, userId, isOrderByName){

    let url = this.DomainUrl.Domain + '/authentication/userAttendance.ent/getUserAttendanceRank.ent?';


    if(branchId){
      url += 'branchId=' + branchId + '&ordered=' + isOrderByName;
    }

    if(userId){
      url += 'userId=' + userId + '&ordered=' + isOrderByName;
    }
    return this.http.get(url)
  }

  getCheckUserAttendance(userId, todayDate){
    let url = this.DomainUrl.Domain + '/authentication/userAttendance.ent/getCheckUserAttendance.ent?userId='+userId+'&checkDate=' + todayDate;

    return this.http.get(url)
  }

  sentMobileMacAddress(userId){
    let serial = this.device.serial;
    let uuid = this.device.uuid;
    let platform = this.device.platform;
    let model = this.device.model;
    let manufacturer = this.device.manufacturer;

    console.log(serial);
    console.log(uuid);
    console.log(platform);
    console.log(model);
    console.log(manufacturer);



    let url = 'www.google.com';

    return this.http.get(url);
  }

  checkIfSameMobile(userId){
    let serial = this.device.serial;
    let uuid = this.device.uuid;
    let platform = this.device.platform;
    let model = this.device.model;
    let manufacturer = this.device.manufacturer;

    console.log(serial);
    console.log(uuid);
    console.log(platform);
    console.log(model);
    console.log(manufacturer);

    return this.LOGIN_WITH_SAME_PHONE;
  }



}
