import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
// import 'rxjs/add/operator/map';
import {Url_domain} from '../../models/url_domain';
// import 'rxjs/observable/fromPromise';
// import 'rxjs/add/operator/mergeMap';
import {Platform} from '@ionic/angular';
import {tap} from 'rxjs/operators';
import {BehaviorSubject, from} from 'rxjs';
import {HTTP} from '@ionic-native/http/ngx';
import {Storage} from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class StudentsService {

  httpOptions: any;
  headers: any;
  val;
  DomainUrl: Url_domain = new Url_domain;
  getAllStudentWithID_7: BehaviorSubject<object> = new BehaviorSubject(null);
  constructor(public http: HttpClient, private httpN:HTTP,private platform: Platform, private storage: Storage) {}

  putHeader(value) {
    this.httpOptions = {
      headers: new HttpHeaders({
        // 'Access-Control-Allow-Origin' : '*',
        // 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT',
        // 'Accept':'application/json',
        // 'content-type':'application/json',
        Authorization: value
      })
    };

    this.val = value;
  }

  getAllStudents(operationId, fromPage: string): any {
    if (operationId == 7 && this.getAllStudentWithID_7.getValue() != null) {
    //   if(this.platform.is('desktop')){
    //     return JSON.parse(localStorage.getItem("ALL_STUDENTS"));
    //   }else{
    //    this.storage.get("ALL_STUDENTS").then(val =>{
    //      return JSON.parse(val);
    //    })
    //   }
      return this.getAllStudentWithID_7;
    } else {
        return this.http.get(this.DomainUrl.Domain + '/authentication/student.ent?operationId=' + operationId + '&name=' +
          fromPage, this.httpOptions).pipe(
            tap(response => {
              if (operationId == 7) {
                if(this.platform.is('desktop')){
                  localStorage.setItem("ALL_STUDENTS", JSON.stringify(response));
                }else{
                  this.storage.set("ALL_STUDENTS", JSON.stringify(response))
                }
                // this.getAllStudentWithID_7.next(response);
              }
            }, err => {}));
    }
  }

  getAllStudentsForReport(operationId, id, date, reportId) {
    let URL = this.DomainUrl.Domain + '/authentication/student.ent?operationId=' + operationId + '&id=' + id
        + '&date=' + date;

    if (reportId != null) {
      URL = URL + '&reportId=' + reportId;
    }

    // if(this.platform.is('cordova')){
    //   return from(this.httpN.get(URL, {}, {'Authorization': this.val}));
    // }else{
      return this.http.get(URL, this.httpOptions);
    // }

  }

  findStudentByID(id, students) {
    return students.find(x => x.id === id);
  }

}
