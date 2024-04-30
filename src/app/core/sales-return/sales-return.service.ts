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
  getSalesReturnList() {
    return this.http.get(environment.apiUrl + '/Sales/getSalesReturnList');
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
}