import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})

export class staffService {
  constructor(private http: HttpClient) { }
  addStaffData(data: any) {
    return this.http.post(environment.apiUrl + '/StaffController/addStaff', data);
  }
  getStaffData() {
    return this.http.get(environment.apiUrl + '/StaffController/getAllStaffList');
  }
  getStaffDataById(id: any) {
    return this.http.get(environment.apiUrl + `/StaffController/getStaffById/${id}`);
  }
  updateStaffData(data: any) {
    return this.http.put(environment.apiUrl + '/StaffController/updateStaff', data);
  }
  deleteStaffData(id: any){
    return this.http.delete(environment.apiUrl + `/StaffController/deleteStaff/${id}`);
  }
  getIdTypeList() {
    return this.http.get(environment.apiUrl + '/StaffController/getIdTypeList');
  }

  // updateLeaveData(data: any) {
  //   return this.http.put(environment.apiUrl + '/StaffController/updateLeave', data);
  // }
  // deleteLeaveData(id: any){
  //   return this.http.delete(environment.apiUrl + `/StaffController/deleteLeave/${id}`);
  // }



}