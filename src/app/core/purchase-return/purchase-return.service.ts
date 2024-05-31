import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})

export class PurchaseReturnService {
  constructor(private http: HttpClient) { }
  // Purchase APIS
  AddPurchaseReturnData(data: any) {
    return this.http.post(environment.apiUrl + '/Purchase/createPurchase', data);
  }
  GetPurchaseReturnData() {
    return this.http.get(environment.apiUrl + '/Purchase/getPurchaseList');
  }
  GetPurchaseReturnDataById(id: any) {
    return this.http.get(environment.apiUrl + `/Purchase/getPurchaseById/${id}`);
  }
  UpdatePurchaseReturnData(data: any) {
    return this.http.put(environment.apiUrl + '/Purchase/updatePurchase', data);
  }
  DeletePurchaseReturnData(id: any){
    return this.http.delete(environment.apiUrl + `/Purchase/deletePurchase/${id}`);
  }
}