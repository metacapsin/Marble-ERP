import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})

export class SalesService {
  constructor(private http: HttpClient) { }
  // sales APIS
  AddSalesData(data: any) {
    return this.http.post(environment.apiUrl + '/Sales/createSales', data);
  }
  GetSalesData() {
    return this.http.get(environment.apiUrl + '/Sales/getSalesList ');
  }
  GetSalesDataById(id: any) {
    return this.http.get(environment.apiUrl + `/Sales/getSalesById/${id}`);
  }

  UpdateSalesData(data: any) {
    return this.http.put(environment.apiUrl + '/Sales/updateSales', data);
  }
  DeleteSalesData(id: any){
    return this.http.delete(environment.apiUrl + `/Sales/deleteSales/${id}`);
  }
}