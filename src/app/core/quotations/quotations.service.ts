import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse} from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { an } from '@fullcalendar/core/internal-common';
import { catchError, Observable, throwError } from 'rxjs';

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

  downloadQuotationInvoice(id: any): Observable<Blob> {
    const url = `${environment.apiUrl}/QuotationController/downloadQuotationInvoice/${id}`;
    return this.http
    .get(url, { responseType: "blob" })
    .pipe(catchError(this.handleError));

  }
  
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error);
    return throwError('Something went wrong; please try again later.');
  }
}