import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})

export class UsersdataService {
  constructor(private http: HttpClient) { }
  GetUserDataByID(id: string) {
    return this.http.get(environment.apiUrl + '/Users/getUserById/' + id);
  }
  // user APIS
  GetUserData() {
    return this.http.get(environment.apiUrl + '/Users/getUserList');
  }
  AddUserdata(data: any) {
    return this.http.post(environment.apiUrl + '/Users/createUser', data);
  }
  UpDateUserApi(id: any, data: any) {
    return this.http.put(environment.apiUrl + '/Users/updateUser', data);
  }
  UserDeleteApi(){
    return this.http.delete(environment.apiUrl);
  }
}