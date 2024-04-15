import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})

export class UsersdataService {
  constructor(private http: HttpClient) {}

  GetUserDataByID(id:string){
    return this.http.get(environment.apiUrl + '/getUserById/' + id);
  }

  // user APIS
  GetUserData(){
    return this.http.get(environment.apiUrl + '/getUserList');
  }
  AddUserdata(data: any) {
    return this.http.post(environment.apiUrl + '/createUser', data);
  }
  UpDateUserApi(id:any,data:any) {
    return this.http.post(environment.apiUrl + '/updateUserById/', id, data);
  } 
}