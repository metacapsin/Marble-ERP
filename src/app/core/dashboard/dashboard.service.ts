import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment.development";

@Injectable({
  providedIn: "root",
})
export class dashboardService {
  constructor(private http: HttpClient) {}

  getFinancialSummary(data: {} | null) {
    return this.http.post(
      environment.apiUrl + "/DashboardController/getFinancialSummary",
      data
    );
  }

  getMonthlySalesPurchasesAndCharts(data: {} | null) {
    return this.http.post(
      environment.apiUrl +
        "/DashboardController/getMonthlySalesPurchasesAndCharts",
      data
    );
  }

  getStockSummary(data: {} | null) {
    return this.http.post(
      environment.apiUrl + "/DashboardController/getStockSummary",
      data
    );
  }

  getStockAlert(data: {} | null) {
    return this.http.post(
      environment.apiUrl + "/DashboardController/getStockAlert",
      data
    );
  }

  getTopCustomers(data: {} | null) {
    return this.http.post(
      environment.apiUrl + "/DashboardController/getTopCustomers",
      data
    );
  }

  getPaymentSentRecivedByMonth(data: {} | null) {
    return this.http.post(
      environment.apiUrl + "/DashboardController/getPaymentSentRecivedByMonth",
      data
    );
  }
  getRecentSales(data: {} | null) {
    return this.http.post(
      environment.apiUrl + "/DashboardController/getRecentSales",
      data
    );
  }
}
