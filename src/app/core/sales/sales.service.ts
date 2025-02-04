import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { environment } from "src/environments/environment.development";
import { Observable, catchError, throwError } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class SalesService {
  constructor(private http: HttpClient) {}
  // sales APIS
  AddSalesData(data: any) {
    return this.http.post(environment.apiUrl + "/Sales/createSales", data);
  }
  GetSalesData(data: any) {
    return this.http.post(environment.apiUrl + "/Sales/getSalesList", data);
  }
  GetSalesDataById(id: any) {
    return this.http.get(environment.apiUrl + `/Sales/getSalesById/${id}`);
  }
  getVendorBillingList() {
    return this.http.get(
      environment.apiUrl + `/TaxVendorController/getVendorBillingList`
    );
  }

  UpdateSalesData(data: any) {
    return this.http.put(environment.apiUrl + "/Sales/updateSales", data);
  }
  DeleteSalesData(id: any) {
    return this.http.delete(environment.apiUrl + `/Sales/deleteSales/${id}`);
  }

  getSalesPaymentList(id: any) {
    return this.http.get(
      environment.apiUrl + `/Sales/getSalesPaymentList/${id}`
    );
  }
  getAllSalesByCustomerId(id: any) {
    //all sales by customer id paid or unpaid both
    return this.http.get(
      environment.apiUrl + `/Sales/getSalesByCustomerId/${id}`
    );
  }
  downloadSalesInvoice(id: any): Observable<Blob> {
    const url = `${environment.apiUrl}/SalesController/downloadSalesInvoice/${id}`;
    return this.http
      .post(url, {}, { responseType: "blob" })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error("An error occurred:", error);
    return throwError("Something went wrong; please try again later.");
  }

  getTaxinvoice(id: any) {
    const url = `${environment.apiUrl}/SalesController/downloadTaxInvoice/${id}`;
    return this.http
      .get(url, { responseType: "blob" })
      .pipe(catchError(this.handleError));
  }

  getFullInvoice(id: any) {
    const url = `${environment.apiUrl}/SalesController/downloadSalesInvoice/${id}`;
    return this.http
      .get(url, { responseType: "blob" })
      .pipe(catchError(this.handleError));
  }
}
