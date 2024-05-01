import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})

export class PurchaseService {
  constructor(private http: HttpClient) { }
  // Purchase APIS
  AddPurchaseData(data: any) {
    return this.http.post(environment.apiUrl + '/Purchase/createPurchase', data);
  }
  GetPurchaseData() {
    return this.http.get(environment.apiUrl + '/Purchase/getPurchaseList');
  }
  GetPurchaseDataById(id: any) {
    return this.http.get(environment.apiUrl + `/Purchase/getPurchaseById/${id}`);
  }
  UpdatePurchaseData(data: any) {
    return this.http.put(environment.apiUrl + '/Purchase/updatePurchase', data);
  }
  DeletePurchaseData(id: any){
    return this.http.delete(environment.apiUrl + `/Purchase/deletePurchase/${id}`);
  }
}