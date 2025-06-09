import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface GeneralEntry {
  name: string;
  email?: string;
  phoneNo?: string;
  taxNo?: string;
  billingAddress?: string;
  penCardNumber?: string;
  openingBalance?: number;
  balanceType?: string;
}

@Injectable({
  providedIn: 'root'
})
export class GeneralPartiesService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  GetGeneralPartiesData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/GeneralEntry/getAllGenralEntry`);
  }

  GetGeneralPartyDataById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/GeneralEntry/getGenralEntryById/${id}`);
  }

  AddGeneralPartyApi(data: GeneralEntry): Observable<any> {
    return this.http.post(`${this.apiUrl}/GeneralEntry/createGenralEntry`, data);
  }

  UpdateGeneralPartyApi(id: string, data: GeneralEntry): Observable<any> {
    return this.http.put(`${this.apiUrl}/GeneralEntry/updateGenralEntry`, data);
  }

  DeleteGeneralPartyApi(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/GeneralEntry/deleteGenralEntry/${id}`);
  }

  ImportGeneralParties(data: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/general-parties/import`, data);
  }
} 