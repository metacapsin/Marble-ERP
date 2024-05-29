import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})

export class ExpensesdataService {
  constructor(private http: HttpClient) { }
  // user APIS
  GetExpensesData() {
    return this.http.get(environment.apiUrl + '/ExpensesController/getAllExpensesList');
  }
  AddExpensesdata(data: any) {
    return this.http.post(environment.apiUrl + '/ExpensesController/addExpenses', data);
  }
  GetExpensesDataById(id: any) {
    return this.http.get(environment.apiUrl + `/ExpensesController/getExpensesById/${id}`);
  }

  UpDataExpensesApi(data: any) {
    return this.http.put(environment.apiUrl + `/ExpensesController/updateExpenses`, data);
  }
  DeleteExpensesApi(id: any){
    return this.http.delete(environment.apiUrl + `/ExpensesController/deleteExpenses/${id}`);
  }
}