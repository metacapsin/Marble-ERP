import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  constructor(private http: HttpClient) { }

  getPaymentInReports(data: {} | null) {
    return this.http.post(environment.apiUrl + "/PaymentInController/getPaymentInReports", data);
  }

  getSalesReports(data: {} | null) {
    return this.http.post(environment.apiUrl + "/SalesReportController/getSalesReports", data);
  }
  getPaymentOutReports(data: {} | null) {
    return this.http.post(environment.apiUrl + "/PaymentOutController/getPaymentOutReports", data);
  }

  getPurchaseReports(data: {} | null) {
    return this.http.post(environment.apiUrl + "/PurchaseReportController/getPurchaseReports", data);
  }

  getExpensesReports(data: {} | null) {
    return this.http.post(environment.apiUrl + "/ExpensesReportController/getExpensesReports", data);
  }
  getStockReports(data: {} | null) {
    return this.http.post(environment.apiUrl + "/StockReportController/getStockReports", data);
  }

}
