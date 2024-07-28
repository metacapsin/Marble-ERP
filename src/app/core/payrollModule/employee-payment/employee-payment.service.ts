import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';


@Injectable({
  providedIn: 'root',
})
export class EmployeepPaymentService {
  constructor(private http: HttpClient) { }


  createPayment(data: {} | null) {
    return this.http.post(environment.apiUrl + "/PayrollController/createSalaryPayment", data);
  }
  getSalaryPaymentListByEmployeeId(id: string) {
    return this.http.get(environment.apiUrl + "/PayrollController/getSalaryPaymentListByEmployeeId/" + id);
  }
  getEmployeeLeaves(data: any) {
    return this.http.post(environment.apiUrl + "/PayrollController/getEmployeeLeaves", data);
  }
  getSalaryPaymentById(id: string) {
    return this.http.get(environment.apiUrl + "/PayrollController/getSalaryPaymentById/" + id);
  }
  getSalaryPaymentList() {
    return this.http.get(environment.apiUrl + "/PayrollController/getSalaryPaymentList");
  }
  
  deleteSalaryPayment(id: any) {
    return this.http.delete(environment.apiUrl + "/PayrollController/deleteSalaryPayment/" + id)
  }
  getPaymentDetailById(id: any) {
    return this.http.get(environment.apiUrl + "/PayrollController/getPaymentDetailById/" + id)
  }
  updateSalaryPayment(id: any) {
    return this.http.get(environment.apiUrl + "/PayrollController/updateSalaryPayment/" + id)
  }
}