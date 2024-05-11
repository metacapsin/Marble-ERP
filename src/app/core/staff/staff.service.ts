import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})

export class staffService {
  constructor(private http: HttpClient) { }
  // staff  APIS
  addStaffData(data: any) {
    return this.http.post(environment.apiUrl + '/StaffController/addStaff', data);
  }
  getStaffData() {
    return this.http.get(environment.apiUrl + '/Staff/getAllStaffList');
  }
  getStaffDataById(id: any) {
    return this.http.get(environment.apiUrl + `/Staff/getStaffById/${id}`);
  }

  updateStaffData(data: any) {
    return this.http.put(environment.apiUrl + '/StaffController/updateStaff', data);
  }
  deleteStaffData(id: any){
    return this.http.delete(environment.apiUrl + `/Staff/deleteStaff/${id}`);
  }
}