import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})

export class staffLeavesService {
  constructor(private http: HttpClient) { }
  addLeaveData(data: any) {
    return this.http.post(environment.apiUrl + '/StaffController/addLeave', data);
  }
  getLeaveData() {
    return this.http.get(environment.apiUrl + '/StaffController/getAllLeaveList');
  }
  getLeaveDataById(id: any) {
    return this.http.get(environment.apiUrl + `/StaffController/getLeaveById/${id}`);
  }

  updateLeaveData(data: any) {
    return this.http.put(environment.apiUrl + '/StaffController/updateLeave', data);
  }
  deleteLeaveData(id: any) {
    return this.http.delete(environment.apiUrl + `/StaffController/deleteLeave/${id}`);
  }

}