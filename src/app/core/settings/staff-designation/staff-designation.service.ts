import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class StaffDesignationService {

  constructor(private http: HttpClient) { }


  CreateStaffDesignation(data: {} | null) {
      return this.http.post(environment.apiUrl + "/Setting/addDesignation", data);
    }

  getStaffDesignation() {
    return this.http.get(environment.apiUrl + "/Setting/getAllDesignationList");
  }

  
  getStaffDesignationById(id: string) {
    return this.http.get(environment.apiUrl + "/Setting/getDesignationById/" + id);
  }

  updateStaffDesignation(data: {}) {
      return this.http.put(environment.apiUrl + "/Setting/updateDesignation", data);
  }

  deleteStaffDesignationById(id: any) {
      return this.http.delete(environment.apiUrl + "/Setting/deleteDesignation/" + id, {});
  }
  
}
