/* tslint:disable:max-line-length */
import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Url_domain} from '../../models/url_domain';
// import 'rxjs/add/observable/fromPromise';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/mergeMap';
import {Custom_reports_data} from '../../models/custom_reports_data';
import {BehaviorSubject, from} from 'rxjs';
import {HTTP} from '@ionic-native/http/ngx';
import {Platform} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  DomainUrl: Url_domain;
  private value: any = [];
  private accountFeature: any = [];
  private userRole: any = [];
  private userTelephone: string;
  private userEmail: string;
  private userName: string;
  private userUserName: string;
  private userAddress: string;
  private _userAccount: any;
  private _accountBranchesListIds: any = [];
  private _accountBranchesList: any = [];
  private _tagArry: any = [];
  private Arry: any = [];
  thisCore: boolean;
  private customReportsValue: any = [];
  private customReportsList: any = [];
  private _userBranchId: number;

  private _reportPage: string;
  private _reportId: number;
  private _userId: number;

  private _user:any;

  menuFeatures: BehaviorSubject<object> = new BehaviorSubject(null);

  constructor(private http: HttpClient,private httpN:HTTP, private platform:Platform) {
    this.DomainUrl = new Url_domain();
  }

  getAccountRoles(subHeader: string) {

    const httpOptions =  {headers: new HttpHeaders({
        // 'Access-Control-Allow-Origin' : 'http://localhost:8100',
        // 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT',
        // 'Accept':'application/json',
        // 'content-type':'application/json',
        Authorization : subHeader
      })};
    // if(this.platform.is('cordova')){
    //   return from(this.httpN.post(this.DomainUrl.Domain + '/authentication/authenticator.ent?operationId=3', {}, {'Authorization' : subHeader}));
    // }else {
      return this.http.post(this.DomainUrl.Domain + '/authentication/authenticator.ent?operationId=3', null);
    // }
  }


  getCustomReports(subHeader: string) {
    const httpOptions =  {headers: new HttpHeaders({
        // 'Access-Control-Allow-Origin' : 'http://localhost:8100',
        // 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT',
        // 'Accept':'application/json',
        // 'content-type':'application/json',
        Authorization : subHeader
      })};
    // if(this.platform.is('cordova')){
    //   return from(this.httpN.get(this.DomainUrl.Domain + '/authentication/report.ent/accountReports.ent', {}, {'Authorization' : subHeader}));
    // }else{
      return this.http.get(this.DomainUrl.Domain + '/authentication/report.ent/accountReports.ent');
    // }
  }

  setDate(data: any) {

    this.value = data;
    if (this.value.data != null) {
      this.value = JSON.parse(this.value.data);
    }
    this._userId = this.value.id;
    this.accountFeature = this.value.accountFeatures;
    this.userRole = this.value.userRoles;
    this.userTelephone = this.value.telephone;
    this._userAccount = this.value.userAccount;
    this.userEmail = this.value.email;
    this.userName = this.value.name;
    this.userUserName = this.value.username;
    this.userAddress = this.value.address;
    this.userBranchId = this.value.branchId;
    this._accountBranchesList = this.value.branchesList;
    for (const branch of this.value.branchesList) {
      this._accountBranchesListIds.push(branch.id);
    }
    this._user = this.value;

    this.menuFeatures.next(this.value.accountFeatures);
  }


  setCustomReport(data: any) {
    this.customReportsList = [];
    this.customReportsValue = data;
    for (const item of this.customReportsValue) {
      const CRD = new Custom_reports_data();
      CRD.id = item.id;
      CRD.name = item.name;
      CRD.description = item.description;
      this.customReportsList.push(CRD);
    }
  }


  getTags(subHeader: string) {
    const httpOptions =  {headers: new HttpHeaders({
        // 'Access-Control-Allow-Origin' : 'http://localhost:8100',
        // 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT',
        // 'Accept':'application/json',
        // 'content-type':'application/json',
        Authorization : subHeader
      })};

    // if(this.platform.is('cordova')){
    //   from(this.httpN.get(this.DomainUrl.Domain + '/authentication/tag.ent?branchesIds=' + this.accountBranchesListIds, {},{'Authorization' : subHeader})).subscribe(value => {
    //     this.Arry = value;
    //     for (const tag of this.Arry) {
    //       this._tagArry.push(tag);
    //     }
    //   });
    // }else {

      this.http.get(this.DomainUrl.Domain + '/authentication/tag.ent?branchesIds=' + this.accountBranchesListIds).subscribe(value => {
        this.Arry = value;
        for (const tag of this.Arry) {
          this._tagArry.push(tag);
        }
      });
    // }
  }

  getAccountFeature() {
    return this.accountFeature;
  }

  getUserRole() {
    return this.userRole;
  }
  getUserTelephone() {
    return this.userTelephone;
  }
  getUserEmail() {
    return this.userEmail;
  }
  getUserName() {
    return this.userName;
  }
  getUserUserName() {
    return this.userUserName;
  }
  getUserAddress() {
    return this.userAddress;
  }

  getCustomReportsList() {
    return this.customReportsList;
  }

  get accountBranchesList(): any {
    return this._accountBranchesList;
  }

  set accountBranchesList(value: any) {
    this._accountBranchesList = value;
  }

  get accountBranchesListIds(): any {
    return this._accountBranchesListIds;
  }

  set accountBranchesListIds(value: any) {
    this._accountBranchesListIds = value;
  }


  get tagArry(): any {
    return this._tagArry;
  }

  set tagArry(value: any) {
    this._tagArry = value;
  }


  get reportPage(): string {
    return this._reportPage;
  }

  set reportPage(value: string) {
    this._reportPage = value;
  }


  get reportId(): any {
    return this._reportId;
  }

  set reportId(value: any) {
    this._reportId = value;
  }

  get userId(): number {
    return this._userId;
  }

  set userId(value: number) {
    this._userId = value;
  }

  get userBranchId(): number {
    return this._userBranchId;
  }

  set userBranchId(value: number) {
    this._userBranchId = value;
  }


  get userAccount(): any {
    return this._userAccount;
  }


  get user(): any {
    return this._user;
  }

  set user(value: any) {
    this._user = value;
  }
}