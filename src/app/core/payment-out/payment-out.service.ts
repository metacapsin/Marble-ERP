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
  getPaymentList() {
    return this.http.get(environment.apiUrl + "/Purchase/getPurchasePaymentList");
  }
  getSalesBySupplierId(id: any) {
    return this.http.get(environment.apiUrl + "/Purchase/getPurchasePaymentListBySupplierId/" + id)
  }
  deletePaymentById(id: any) {
    return this.http.delete(environment.apiUrl + "/Purchase/deletePurchasePayment/" + id)
  }
  
  getPaymentById(id: string) {
    return this.http.get(environment.apiUrl + "/Purchase/getPurchasePaymentById/:id" + id);
  }
  getPaymentDetailById(id: any) {
    return this.http.get(environment.apiUrl + "/Sales/getPaymentDetailById/" + id)
  }
}