import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import 'rxjs/add/operator/map';

@Injectable()
export class LoginService {

  localStorageToken:string = 'LOCAL_STORAGE_TOKEN';
  localStorageUserName:string = 'LOCAL_STORAGE_USERNAME';
  localStoragePassword:string = 'LOCAL_STORAGE_PASSWORD';
  accessToken:string;


  constructor(private http: HttpClient) {}

  postlogin(username: string, password: string) {
    return this.http.post('/oauth/token?grant_type=password&client_id=my-trusted-client&password='
      + password + '&username=' + username, null);
  }

  authenticateUserByRefreshToken(refreshToken:string){
    return this.http.get('/oauth/token?grant_type=refresh_token&client_id=my-trusted-client&refresh_token='
      +refreshToken);
  }


  authenticateUserManager(accessToken:string,subHeader:string){
    const httpOptions =  {headers: new HttpHeaders({
        // 'Access-Control-Allow-Origin' : 'http://localhost:8100',
        // 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT',
        // 'Accept':'application/json',
        // 'content-type':'application/json',
        'Authorization' : subHeader
      })};
    return this.http.get('/authentication/manage.ent?access-token=' + accessToken,httpOptions);
  }


}
