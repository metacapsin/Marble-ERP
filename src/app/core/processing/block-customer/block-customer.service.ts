import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})

export class blockCustomersDataService {
  constructor(private http: HttpClient) { }
  // user APIS
  creatBlockCustomer(data: any) {
    return this.http.post(environment.apiUrl + '/BlockCustomerController/createBlockCustomer', data);
  }
  getAllBlockCustomerData() {
    return this.http.get(environment.apiUrl + '/BlockCustomerController/getAllBlockCustomer');
  }
  getBlockCustomerDataById(id: any) {
    return this.http.get(environment.apiUrl + `/BlockCustomerController/getBlockCustomerById/${id}`);
  }

  updateBlockCustomerData(data: any) {
    return this.http.put(environment.apiUrl + `/BlockCustomerController/updateBlockCustomer`, data);
  }
  DeleteBlockCustomer(id: any){
    return this.http.delete(environment.apiUrl + `/BlockCustomerController/deleteBlockCustomer/${id}`);
  }
}