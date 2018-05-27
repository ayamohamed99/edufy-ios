import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable()
export class StudentsService{

  httpOptions:any;

  constructor(public http:HttpClient){}

  putHeader(value){
    this.httpOptions = {
      headers: new HttpHeaders({
        'content-type': 'application/json',
        'Authorization': value
      })
    };
  }

  getAllStudents(fromPage:string){
    return this.http.get('/authentication/student.ent?operationId=7& name='+fromPage,this.httpOptions);
  }

}
