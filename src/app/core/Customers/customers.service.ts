import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})

export class CustomersdataService {
  constructor(private http: HttpClient) { }
  // user APIS
  GetCustomerData() {
    return this.http.get(environment.apiUrl + '/Customer/getAllCustomer');
  }
  AddCustomerdata(data: any) {
    return this.http.post(environment.apiUrl + '/Customer/createCustomer', data);
  }



  UpDataCustomerApi(data: any) {
    return this.http.put(environment.apiUrl + '/Users/updateUser', data);
  }
  DeleteCustomerApi(){
    return this.http.delete(environment.apiUrl);
  }
}