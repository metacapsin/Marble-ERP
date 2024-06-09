import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})

export class SalesReturnService {
  constructor(private http: HttpClient) { }
  // sales Return APIS
  createSalesReturn(data: any) {
    return this.http.post(environment.apiUrl + '/Sales/createSalesReturn', data);
  }
  createSalesReturnPayment(data: any) {
    return this.http.post(environment.apiUrl + '/Sales/createSalesReturnPayment', data);
  }
  getSalesReturnList() {
    return this.http.get(environment.apiUrl + '/Sales/getSalesReturnList');
  }
  // getSalesReturnPaymentList() { //on payment
  //   return this.http.get(environment.apiUrl + '/Sales/getSalesReturnPaymentList');
  // }
  getSalesReturnById(id: any) {
    return this.http.get(environment.apiUrl + `/Sales/getSalesReturnById/${id}`);
  }
  getSalesReturnPaymentById(id: any) {//on popup of sales Return
    return this.http.get(environment.apiUrl + `/Sales/getSalesReturnPaymentById/${id}`);
  }
  getSalesReturnByCustomerId(id: any) {
    return this.http.get(environment.apiUrl + `/Sales/getSalesReturnByCustomerId/${id}`);
  }
  getSalesReturnPaymentListByCustomerId(id: any) {//on payment out list 
    return this.http.get(environment.apiUrl + `/Sales/getSalesReturnPaymentListByCustomerId/${id}`);
  }
  getSalesReturnPaymentListBySalesReturnId(id: any) {//on payment out list 
    return this.http.get(environment.apiUrl + `/Sales/getSalesReturnPaymentListBySalesReturnId/${id}`);
  }
  updateSalesReturn(data: any) {
    return this.http.put(environment.apiUrl + '/Sales/updateSalesReturn', data);
  }
  deleteSalesReturn(id: any){
    return this.http.delete(environment.apiUrl + `/Sales/deleteSalesReturn/${id}`);
  }
}