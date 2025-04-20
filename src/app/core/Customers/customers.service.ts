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
  GetCustomerDataById(id: any) {
    return this.http.get(environment.apiUrl + `/Customer/getCustomerById/${id}`);
  }

  GetOpeningBalanceById(id: any) {
    return this.http.get(environment.apiUrl + `/Customer/getOpeningBalanceByPartyId/${id}`);
  }

  GetOpeningBalancePayListById(id: any) {
    return this.http.get(environment.apiUrl + `/Customer/getOpeningBalancePaymentList/${id}`);
  }

  UpDataCustomerApi(data: any) {
    return this.http.put(environment.apiUrl + `/Customer/updateCustomer`, data);
  }
  UpdateCustomerShippingAddress(data: any) {
    return this.http.put(environment.apiUrl + `/Customer/updateCustomerShippingAddress`, data);
  }
  DeleteCustomerApi(id: any){
    return this.http.delete(environment.apiUrl + `/Customer/deleteCustomer/${id}`);
  }
}