import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})

export class PurchaseReturnService {
  constructor(private http: HttpClient) { }
  // Purchase APIS
  // AddPurchaseReturnData(data: any) {
  //   return this.http.post(environment.apiUrl + '/Purchase/createPurchase', data);
  // }
  // GetPurchaseReturnData() {
  //   return this.http.get(environment.apiUrl + '/Purchase/getPurchaseList');
  // }
  // GetPurchaseReturnDataById(id: any) {
  //   return this.http.get(environment.apiUrl + `/Purchase/getPurchaseById/${id}`);
  // }
  // UpdatePurchaseReturnData(data: any) {
  //   return this.http.put(environment.apiUrl + '/Purchase/updatePurchase', data);
  // }
  // DeletePurchaseReturnData(id: any){
  //   return this.http.delete(environment.apiUrl + `/Purchase/deletePurchase/${id}`);
  // }

  createPurchaseReturn(data: any) {
    return this.http.post(environment.apiUrl + '/Purchase/createPurchaseReturn', data);
  }
  createPurchaseReturnPayment(data: any) {
    return this.http.post(environment.apiUrl + '/Purchase/createPurchaseReturnPayment', data);
  }
  getPurchaseReturnList() {
    return this.http.get(environment.apiUrl + '/Purchase/getPurchaseReturnList');
  }
  // getPurchaseReturnPaymentList() { //on payment
  //   return this.http.get(environment.apiUrl + '/Purchase/getPurchaseReturnPaymentList');
  // }
  getPurchaseReturnById(id: any) {
    return this.http.get(environment.apiUrl + `/Purchase/getPurchaseReturnById/${id}`);
  }
  getPurchaseReturnPaymentById(id: any) {//on popup of Purchase Return
    return this.http.get(environment.apiUrl + `/Purchase/getPurchaseReturnPaymentById/${id}`);
  }
  getPurchaseReturnBySupplierId(id: any) {
    return this.http.get(environment.apiUrl + `/Purchase/getPurchaseReturnBySupplierId/${id}`);
  }
  getPurchaseReturnPaymentListBySupplierId(id: any) {//on payment out list 
    return this.http.get(environment.apiUrl + `/Purchase/getPurchaseReturnPaymentListBySupplierId/${id}`);
  }
  getPurchaseReturnPaymentListbyPurchaseReturnId(id: any) {//on payment out list 
    return this.http.get(environment.apiUrl + `/Purchase/getPurchaseReturnPaymentListbyPurchaseReturnId/${id}`);
  }
  updatePurchaseReturn(data: any) {
    return this.http.put(environment.apiUrl + '/Purchase/updatePurchaseReturn', data);
  }
  deletePurchaseReturn(id: any){
    return this.http.delete(environment.apiUrl + `/Purchase/deletePurchaseReturn/${id}`);
  }
}