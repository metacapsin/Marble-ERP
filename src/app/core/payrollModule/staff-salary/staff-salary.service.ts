import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})

export class StaffSalaryService {
  constructor(private http: HttpClient) { }
  // EmployeeSalary  APIS
  addEmployeeSalaryData(data: any) {
    return this.http.post(environment.apiUrl + '/PayrollController/addEmployeeSalary', data);
  }
  getEmployeeSalaryData() {
    return this.http.get(environment.apiUrl + '/PayrollController/getAllEmployeeSalaryList');
  }
  getEmployeeSalaryDataById(id: any) {
    return this.http.get(environment.apiUrl + `/PayrollController/getEmployeeSalaryById/${id}`);
  }

  updateEmployeeSalaryData(data: any) {
    return this.http.put(environment.apiUrl + '/PayrollController/updateEmployeeSalary', data);
  }
  deleteEmployeeSalaryData(id: any){
    return this.http.delete(environment.apiUrl + `/PayrollController/deleteEmployeeSalary/${id}`);
  }
}