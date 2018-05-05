import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import 'rxjs/add/operator/map';

@Injectable()
export class LoginService {

  localStorageToken:string = 'LOCAL_STORAGE_TOKEN';
  localStorageUserName:string = 'LOCAL_STORAGE_USERNAME';
  localStoragePassword:string = 'LOCAL_STORAGE_PASSWORD';

  constructor(private http: HttpClient) {}

  postlogin(username: string, password: string) {
    return this.http.post('/oauth/token?grant_type=password&client_id=my-trusted-client&password='
      + password + '&username=' + username, null);
  }


}
