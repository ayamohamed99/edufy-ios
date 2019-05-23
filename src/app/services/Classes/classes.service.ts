import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
// import 'rxjs/add/operator/map';
import {Url_domain} from '../../models/url_domain';
// import 'rxjs/observable/fromPromise';
// import 'rxjs/add/operator/mergeMap';
import {Platform} from '@ionic/angular';
import {BehaviorSubject} from 'rxjs';
import {tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClassesService {

  httpOptions: any;
  headers: any;
  DomainUrl: Url_domain = new Url_domain;
  getClassListWithID_2_AND_NOT_REPORTS: BehaviorSubject<object> = new BehaviorSubject(null);
  constructor(public http: HttpClient, private platform: Platform) {}

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
  }


  getClassList(viewName, opId, date, id, branchId, reportId): any {

    let URL = this.DomainUrl.Domain + '/authentication/class.ent?view=' + viewName + '&operationId=' + opId;
    if (id != null) {
      URL += '&id=' + id;
    }
    if (date != null) {
      URL += '&date=' + date;
    }
    if (branchId != null) {
      URL += '&branchId=' + branchId;
    }
    if (reportId != null) {
      URL += '&reportId=' + reportId;
    }

    if (opId == 2 && this.getClassListWithID_2_AND_NOT_REPORTS.getValue() != null) {
      return this.getClassListWithID_2_AND_NOT_REPORTS;
    } else {
      return this.http.get(URL, this.httpOptions).pipe(
          tap(response => {
            if (opId == 2) {
              this.getClassListWithID_2_AND_NOT_REPORTS.next(response);
            }
          }, err => {

          }));
    }
  }
}
