import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class VisitReasonsService {
  deleteVisitReasonByI() {
    throw new Error('Method not implemented.');
  }

  constructor(private http: HttpClient) { }

  CreateVisitReason(data: {} | null) {
    return this.http.post(environment.apiUrl + "/VisitReasons/CreateVisitReason", data);
  }

  getVisitReasonsList() {
    return this.http.get(environment.apiUrl + "/VisitReasons/getVisitReasonsList");
  }
  getVisitReasonById(id: any) {
    return this.http.get(environment.apiUrl + "/VisitReasons/getVisitReasonById/" + id);
  }
  deleteVisitReasonById(id: any) {
    return this.http.delete(environment.apiUrl + "/VisitReasons/deleteVisitReasonById/" + id);
  }
  updateVisitReason(data: {}) {
    return this.http.put(environment.apiUrl + "/VisitReasons/updateVisitReason/", data);
  }

}
