import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BankAccountsService {
  private apiUrl = `${environment.apiUrl}/Setting`;

  constructor(private http: HttpClient) { }

  // Get all bank accounts
  getBankAccountsList(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getBankAccountList`);
  }

  // Get bank account by ID
  getBankAccountById(id: string) {
    return this.http.get(`${this.apiUrl}/getBankAccountById/${id}`);
  }

  // Add new bank account
  addBankAccount(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/createBankAccount`, data);
  }

  // Update bank account
  updateBankAccount(id: string, data: any): Observable<any> {
    const requestBody = {
      ...data,
      id: id
    };
    return this.http.put(`${this.apiUrl}/updateBankAccount`, requestBody);
  }

  // Delete bank account
  deleteBankAccount(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteBankAccountById/${id}`);
  }
} 