import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class StaffDesignationService {

  constructor(private http: HttpClient) { }


  CreateStaffDesignation(data: {} | null) {
      return this.http.post(environment.apiUrl + "/StaffController/addDesignation", data);
    }

  getStaffDesignation() {
    return this.http.get(environment.apiUrl + "/StaffController/getAllDesignationList");
  }

  
  getStaffDesignationById(id: string) {
    return this.http.get(environment.apiUrl + "/StaffController/getDesignationById/" + id);
  }

  updateStaffDesignation(data: {}) {
      return this.http.put(environment.apiUrl + "/StaffController/updateDesignation", data);
  }

  deleteStaffDesignationById(id: any) {
      return this.http.delete(environment.apiUrl + "/StaffController/deleteDesignation/" + id, {});
  }
  
}
