import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { an } from '@fullcalendar/core/internal-common';

@Injectable({
  providedIn: 'root',
})

export class QuotationsService {
  constructor(private http: HttpClient) { }
  // sales APIS
  createQuotation(data: any) {
    return this.http.post(environment.apiUrl + '/QuotationController/createQuotation', data);
  }
  getQuotationList(data: any) {
    return this.http.post(environment.apiUrl + '/QuotationController/getQuotationList', data );
  }
  getQuotationById(id: any) {
    return this.http.get(environment.apiUrl + `/QuotationController/getQuotationById/${id}`);
  }
  updateQuotation(data: any) {
    return this.http.put(environment.apiUrl + '/QuotationController/updateQuotation', data);
  }
  deleteQuotation(id: any){
    return this.http.delete(environment.apiUrl + `/QuotationController/deleteQuotation/${id}`);
  }

  getQuotationByCustomerId(id: any) {
    return this.http.get(environment.apiUrl + `/QuotationController/getQuotationByCustomerId/${id}`)
  }
}