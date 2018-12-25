import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import 'rxjs/add/operator/map';
import {Url_domain} from "../models/url_domain";
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/mergeMap';
import {Platform} from "ionic-angular";


@Injectable()
export class ChatService{
  DomainUrl:Url_domain;
  commonUrl= '/authentication/notification.ent';

  httpOptions:any;
  headers:any;

  val:any;

  constructor(private http: HttpClient, private platform:Platform)
  {
    this.DomainUrl = new Url_domain;
  }

  putHeader(value){
    this.httpOptions = {
      headers: new HttpHeaders({
        'content-type':'application/json',
        'Authorization': value
      })
    };
    this.val = value;
  }


}
