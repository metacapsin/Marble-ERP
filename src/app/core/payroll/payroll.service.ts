import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})

export class payrollService {
  constructor(private http: HttpClient) { }
  // EmployeeSalary  APIS
  addEmployeeSalaryData(data: any) {
    return this.http.post(environment.apiUrl + '/EmployeeSalaryController/addEmployeeSalary', data);
  }
  getEmployeeSalaryData() {
    return this.http.get(environment.apiUrl + '/EmployeeSalaryController/getAllEmployeeSalaryList');
  }
  getEmployeeSalaryDataById(id: any) {
    return this.http.get(environment.apiUrl + `/EmployeeSalaryController/getEmployeeSalaryById/${id}`);
  }

  updateEmployeeSalaryData(data: any) {
    return this.http.put(environment.apiUrl + '/EmployeeSalaryController/updateEmployeeSalary', data);
  }
  deleteEmployeeSalaryData(id: any){
    return this.http.delete(environment.apiUrl + `/EmployeeSalaryController/deleteEmployeeSalary/${id}`);
  }
}