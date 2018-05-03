import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import 'rxjs/add/operator/map';

@Injectable()
export class LoginService {


  constructor(private http: HttpClient) {}

  postlogin(username: string, password: string) {
    return this.http.post('/oauth/token?grant_type=password&client_id=my-trusted-client&password='
      + password + '&username=' + username, null);
  }


}
