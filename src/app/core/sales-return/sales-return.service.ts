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
  getSalesReturnList(data: any) {
    return this.http.post(environment.apiUrl + '/Sales/getSalesReturnList', data);
  }
  getSalesReturnById(id: any) {
    return this.http.get(environment.apiUrl + `/Sales/getSalesReturnById/${id}`);
  }
  getSalesReturnByCustomerId(id: any) {
    return this.http.get(environment.apiUrl + `/Sales/getSalesReturnByCustomerId/${id}`);
  }
  updateSalesReturn(data: any) {
    return this.http.put(environment.apiUrl + '/Sales/updateSalesReturn', data);
  }
  deleteSalesReturn(id: any){
    return this.http.delete(environment.apiUrl + `/Sales/deleteSalesReturn/${id}`);
  }

  //sales Return Payment
  createSalesReturnPayment(data: any) {
    return this.http.post(environment.apiUrl + '/Sales/createSalesReturnPayment', data);
  }
  // getSalesReturnPaymentList() { //on payment
  //   return this.http.get(environment.apiUrl + '/Sales/getSalesReturnPaymentList');
  // }
  // getSalesReturnPaymentById(id: any) {//on popup of sales Return
  //   return this.http.get(environment.apiUrl + `/Sales/getSalesReturnPaymentById/${id}`);
  // }
  getSalesReturnPaymentListByCustomerId(id: any) {//on payment out list 
    return this.http.get(environment.apiUrl + `/Sales/getSalesReturnPaymentListByCustomerId/${id}`);
  }
  getSalesReturnPaymentListBySalesReturnId(id: any) {//on payment out list 
    return this.http.get(environment.apiUrl + `/Sales/getSalesReturnPaymentListBySalesReturnId/${id}`);
  }

  deleteSalesReturnPayment(id: any){
    return this.http.delete(environment.apiUrl + `/Sales/deleteSalesReturnPayment/${id}`);
  }

  deleteopeningBalance(id: any){
    return this.http.delete(environment.apiUrl + `/Customer/deleteOpeningBalancePayment/${id}`);
  }

  deleteBalancePayRec(id: any){
    return this.http.delete(environment.apiUrl + `/Customer/deleteOpeningBalancePayment/${id}`);
  }
}

 