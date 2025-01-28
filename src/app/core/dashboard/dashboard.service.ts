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
  getCustomerCreditAlerts(data: {} | null) {
    return this.http.post(
      environment.apiUrl + "/DashboardController/getCustomerCreditAlerts",
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
  getStockWarehouseWise() {
    return this.http.get(
      environment.apiUrl + "/DashboardController/getStockWarehouseWise");
  }

 getUpdatedTime(){
  return this.http.get(
    environment.apiUrl + '/Preference/getPreference'
  )
 }

 updAtedateRange(date:any){
  return this.http.put(
    environment.apiUrl + '/Preference/updatePreference',date
  )
 }

 getFormattedDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0'); 
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${month}/${day}/${year}`;
}

}
