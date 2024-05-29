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
    return this.http.get(environment.apiUrl + '/ExpensesController/getAllExpenseCategoryList');
  }
  AddExpensesdata(data: any) {
    return this.http.post(environment.apiUrl + '/ExpensesController/addExpenseCategories', data);
  }
  GetExpensesDataById(id: any) {
    return this.http.get(environment.apiUrl + `/ExpensesController/getExpenseCategoryById/${id}`);
  }
  UpDataExpensesApi(data: any) {
    return this.http.put(environment.apiUrl + `/ExpensesController/updateExpenseCategory`, data);
  }
  DeleteExpensesApi(id: any){
    return this.http.delete(environment.apiUrl + `/ExpensesController/deleteExpenseCategory${id}`);
  }
}