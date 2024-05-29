import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})

export class ExpensesCategoriesdataService {
  constructor(private http: HttpClient) { }
  // user APIS
  GetExpensesCategriesData() {
    return this.http.get(environment.apiUrl + '/ExpensesController/getAllExpenseCategoryList');
  }
  AddExpensesCategriesdata(data: any) {
    return this.http.post(environment.apiUrl + '/ExpensesController/addExpenseCategories', data);
  }
  GetExpenseCategriesDataById(id: any) {
    return this.http.get(environment.apiUrl + `/ExpensesController/getExpenseCategoryById/${id}`);
  }
  UpDataExpensesCategriesApi(data: any) {
    return this.http.put(environment.apiUrl + `/ExpensesController/updateExpenseCategory`, data);
  }
  DeleteExpensesCategriesApi(id: any){
    return this.http.delete(environment.apiUrl + `/ExpensesController/deleteExpenseCategory/${id}`);
  }
}