import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})

export class ExpensesCategoriesdataService {
  constructor(private http: HttpClient) { }
  // user APIS
  GetExpensesData() {
    return this.http.get(environment.apiUrl + '/Expenses/getAllExpensesCategory');
  }
  AddExpensesdata(data: any) {
    return this.http.post(environment.apiUrl + '/Expenses/createExpensesCategory', data);
  }
  GetExpensesDataById(id: any) {
    return this.http.get(environment.apiUrl + `/Expenses/getExpensesCategoryById/${id}`);
  }
  UpDataExpensesApi(data: any) {
    return this.http.put(environment.apiUrl + `/Expenses/updateExpensesCategory`, data);
  }
  DeleteExpensesApi(id: any){
    return this.http.delete(environment.apiUrl + `/Expenses/deleteExpensesCategory/${id}`);
  }
}