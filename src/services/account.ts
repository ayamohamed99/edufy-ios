import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Url_domain} from "../modles/url_domain";
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';


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
  private _accountBranchesListIds:any = [];
  private _accountBranchesList:any = [];
  private _tagArry:any = [];
  private Arry:any = [];
  thisCore:boolean;

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
    this._accountBranchesList =this.value.branchesList;
    for(let branch of this.value.branchesList){
      this._accountBranchesListIds.push(branch.id);
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

      this.http.get(this.DomainUrl.Domain + '/authentication/tag.ent?branchesIds=' + this._accountBranchesListIds, httpOptions).subscribe(value => {
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

}
