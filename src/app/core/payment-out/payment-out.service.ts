import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';


@Injectable({
  providedIn: 'root',
})
export class PaymentOutService {
  constructor(private http: HttpClient) { }
  
  
  createPayment(data: {} | null) {
    return this.http.post(environment.apiUrl + "/Purchase/createPurchasePayment", data);
  }
  getPurchasePaymentById(id: string) {
    return this.http.get(environment.apiUrl + "/Purchase/getPurchasePaymentById/:id" + id);
  }
  getPurchasePaymentListByPurchaseId(id: any) {
    return this.http.get(environment.apiUrl + "/Purchase/getPurchasePaymentListByPurchaseId/" + id)
  }
 
  getPurchasePaymentListBySupplierId(id: any) {
    return this.http.get(environment.apiUrl + "/Purchase/getPurchasePaymentListBySupplierId/" + id)
  }
  getPurchasePaymentList() {
    return this.http.get(environment.apiUrl + "/Purchase/getPurchasePaymentList");
  }
  deletePurchasePayment(id: any) {
    return this.http.delete(environment.apiUrl + "/Purchase/deletePurchasePayment/" + id)
  }
  

}