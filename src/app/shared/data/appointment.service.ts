import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  constructor(private http: HttpClient) { }

  getAppointmentList(data=[]) {
    return this.http.post(environment.apiUrl + "/Appointment/getAppointmentList",data);
  }
  getAppointmentById(apptId:any) {
    return this.http.get(environment.apiUrl +  `/Appointment/getAppointmentById/${apptId}`);
  }
  createAppointment(requestBody:{}) {
    return this.http.post(environment.apiUrl + "/Appointment/createAppointment",requestBody);
  }

  deleteAppointment(apptId:string){
    return this.http.delete(environment.apiUrl + `/Appointment/deleteAppointment/${apptId}`)
  }
  
  updateAppointment(requestBody:{}){
    return this.http.put(environment.apiUrl + `/Appointment/updateAppointment`,requestBody)
  }
  appointmentConflict(requestBody:{}){
    return this.http.post(environment.apiUrl + `/Appointment/conflict`,requestBody)
  }

}
