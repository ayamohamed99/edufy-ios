import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import 'rxjs/add/operator/map';
import {Url_domain} from "../models/url_domain";
import 'rxjs/observable/fromPromise';
import 'rxjs/add/operator/mergeMap';
import {Platform} from "ionic-angular";
import {tap} from "rxjs/operators";
import {BehaviorSubject} from "rxjs";

@Injectable()
export class StudentsService{

  httpOptions:any;
  headers:any;
  DomainUrl:Url_domain = new Url_domain;
  getAllStudentWithID_7:BehaviorSubject<object> = new BehaviorSubject(null);
  constructor(public http:HttpClient,private platform:Platform){}

  putHeader(value){
    this.httpOptions = {
      headers: new HttpHeaders({
        // 'Access-Control-Allow-Origin' : '*',
        // 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT',
        // 'Accept':'application/json',
        // 'content-type':'application/json',
        'Authorization': value
      })
    };
  }

  getAllStudents(operationId,fromPage:string):any{
    if(operationId == 7 && this.getAllStudentWithID_7.getValue() != null){
      return this.getAllStudentWithID_7;
    }else {
      return this.http.get(this.DomainUrl.Domain + '/authentication/student.ent?operationId=' + operationId + '&name=' +
        fromPage, this.httpOptions).pipe(
          tap(response => {
              if(operationId == 7) {
                this.getAllStudentWithID_7.next(response);
              }
            },err => {}));
    }
  }

  getAllStudentsForReport(operationId,id,date,reportId){
    let URL = this.DomainUrl.Domain + '/authentication/student.ent?operationId=' + operationId + '&id=' + id
      + '&date=' + date;

    if (reportId != null) {
      URL = URL + '&reportId=' + reportId;
    }

    return this.http.get(URL,
      this.httpOptions);
  }

  findStudentByID(id,students){
    return students.find(x => x.id === id);
  }
}
