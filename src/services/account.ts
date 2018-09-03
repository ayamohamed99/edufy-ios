import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Url_domain} from "../models/url_domain";
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import {Custom_reports_data} from "../models/custom_reports_data";


@Injectable()
export class AccountService{

  DomainUrl:Url_domain;
  private value:any = [];
  private accountFeature:any = [];
  private userRole:any = [];
  private userTelephone:string;
  private userEmail:string;
  private userName:string;
  private userUserName:string;
  private userAddress:string;
  private _accountBranchesList:any = [];
  private _tagArry:any = [];
  private Arry:any = [];
  thisCore:boolean;
  private customReportsValue:any = [];
  private customReportsList:any = [];

  private _reportPage:string;
  private _reportId:any;
  constructor(private http: HttpClient) {
    this.DomainUrl=new Url_domain();
  }

  getAccountRoles(subHeader:string){

    const httpOptions =  {headers: new HttpHeaders({
            // 'Access-Control-Allow-Origin' : 'http://localhost:8100',
            // 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT',
            // 'Accept':'application/json',
            // 'content-type':'application/json',
            'Authorization' : subHeader
          })};
      return this.http.post(this.DomainUrl.Domain + '/authentication/authenticator.ent?operationId=3', null, httpOptions);
  }


  getCustomReports(subHeader:string){
    const httpOptions =  {headers: new HttpHeaders({
        // 'Access-Control-Allow-Origin' : 'http://localhost:8100',
        // 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT',
        // 'Accept':'application/json',
        // 'content-type':'application/json',
        'Authorization' : subHeader
      })};

    return this.http.get(this.DomainUrl.Domain + '/authentication/report.ent/accountReports.ent',httpOptions);

  }

  setDate(data:any){

    this.value = data;
    if(this.value.data != null){
      this.value = JSON.parse(this.value.data);
    }
    this.accountFeature = this.value.accountFeatures;
    this.userRole = this.value.userRoles;
    this.userTelephone = this.value.telephone;
    this.userEmail = this.value.email;
    this.userName = this.value.name;
    this.userUserName = this.value.username;
    this.userAddress = this.value.address;
    for(let branch of this.value.branchesList){
      this._accountBranchesList.push(branch.id);
    }
  }


  setCustomReport(data:any){

    this.customReportsValue = data;
    for(let item of this.customReportsValue) {
      let CRD = new Custom_reports_data();
      CRD.id = item.id;
      CRD.name = item.name;
      CRD.description = item.description;
      this.customReportsList.push(CRD);
    }
  }


  getTags(subHeader:string){
    const httpOptions =  {headers: new HttpHeaders({
        // 'Access-Control-Allow-Origin' : 'http://localhost:8100',
        // 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT',
        // 'Accept':'application/json',
        // 'content-type':'application/json',
        'Authorization' : subHeader
      })};

      this.http.get(this.DomainUrl.Domain + '/authentication/tag.ent?branchesIds=' + this._accountBranchesList, httpOptions).subscribe(value => {
        console.log('Tags : ' + value);
        this.Arry = value;
        for (let tag of this.Arry) {
          this._tagArry.push(tag);
        }
      });
  }

  getAccountFeature(){
    return this.accountFeature;
  }

  getUserRole(){
    return this.userRole;
  }
  getUserTelephone(){
    return this.userTelephone;
  }
  getUserEmail(){
    return this.userEmail;
  }
  getUserName(){
    return this.userName;
  }
  getUserUserName(){
    return this.userUserName;
  }
  getUserAddress(){
    return this.userAddress;
  }

  getCustomReportsList(){
    return this.customReportsList;
  }

  get accountBranchesList(): any {
    return this._accountBranchesList;
  }

  set accountBranchesList(value: any) {
    this._accountBranchesList = value;
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
}
