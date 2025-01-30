import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})

export class BillingAddressService {
  constructor(private http: HttpClient) { }
  GetUserDataByID(id: string) {
    return this.http.get(environment.apiUrl + '/Users/getUserById/' + id);
  }
  // user APIS
  getBillingAddressList() {
    return this.http.get(environment.apiUrl + '/Billing/getBillingAddressList');
  }
  getCountries() {
    return this.http.get(environment.apiUrl + '/Setting/getCountries');
  }
  getBillingAddressById(id:any) {
    return this.http.get(environment.apiUrl + '/Billing/getBillingAddressById/' + id);
  }
  createBillingAddress(data: any) {
    return this.http.post(environment.apiUrl + '/Billing/createBillingAddress', data);
  }
  updateBillingAddress(data: any) {
    return this.http.put(environment.apiUrl + '/Billing/updateBillingAddress', data);
  }
  deleteBillingAddressById(id:any){
    return this.http.delete(environment.apiUrl + '/Billing/deleteBillingAddressById/' + id);
  }

getstates(){
  return this.http.get(environment.apiUrl + '/Setting/getState')
}
}