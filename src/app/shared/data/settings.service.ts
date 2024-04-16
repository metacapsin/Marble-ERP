import { Injectable } from '@angular/core';
import { routes } from '../routes/routes';
import { map, Observable } from 'rxjs';
import { apiResultFormat } from '../models/models';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';


@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  constructor(private http: HttpClient) { }

  getCountriesList() {
    return this.http.get(environment.apiUrl + "/Common/getCountries");
  }

  getStateList() {
    return this.http.get(environment.apiUrl + "/Common/getStates/US");
  }

  CreatePracticeInformation(data: {} | null) {
    return this.http.post(environment.apiUrl + "/PracticeInformation/createPracticeInformation", data);
  }

  getPracticeInformationList() {
    return this.http.get(environment.apiUrl + "/PracticeInformation/getPracticeInformationList");
  }

  getPracticeInformationById(id: string) {
    return this.http.get(environment.apiUrl + "/PracticeInformation/getPracticeInformationById/" + id);
  }

  updatePracticeInformationById(data: {}, id: string) {
    return this.http.post(environment.apiUrl + "/PracticeInformation/updatePracticeInformationById/" +id , data);
  }
  deletePracticeInformationById(id: any) {
    return this.http.post(environment.apiUrl + "/PracticeInformation/deletePracticeInformationById/" + id, {});
  }
  getProviderList() {
    return this.http.get(environment.apiUrl + "/ProviderProfile/getProviderList");
  }
  getProviderProfileById(id: any) {
    return this.http.get(environment.apiUrl + "/providerProfile/getProviderProfileById/" + id);
  }

//  service locations

  CreateServiceLocation(data: {} | null) {
    return this.http.post(environment.apiUrl + "/ServiceLocation/createServiceLocation", data);
  }
  getServiceLocationList() {
    return this.http.get(environment.apiUrl + "/ServiceLocation/getServiceLocationList");
  }

  getServiceLocationById(locationId: string) {
    return this.http.get(environment.apiUrl + "/ServiceLocation/getServiceLocationById/" + locationId);
  }

  updateServiceLocationById(data: {}) {
    return this.http.put(environment.apiUrl + "/ServiceLocation/updateServiceLocation" , data);
  }


  deleteServiceLocationById(id: string) {
    return this.http.delete(environment.apiUrl + "/ServiceLocation/deleteServiceLocationById/" + id, {});
  }

// setting warehouse

CreateWarehouse(data: {} | null) {
  return this.http.post(environment.apiUrl + "/Warehouse/createWarehouse", data);
}
getWarehouseList() {
  return this.http.get(environment.apiUrl + "/Warehouse/getWarehouseList");
}

getWarehouseById(locationId: string) {
  return this.http.get(environment.apiUrl + "/Warehouse/getWarehouseById/" + locationId);
}

updateWarehouseById(data: {}) {
  return this.http.put(environment.apiUrl + "/Warehouse/updateWarehouse" , data);
}


deleteWarehouseById(id: string) {
  return this.http.delete(environment.apiUrl + "/Warehouse/deleteWarehouseById/" + id, {});
}



// setting Product

CreateProduct(data: {} | null) {
  return this.http.post(environment.apiUrl + "/Product/createProduct", data);
}
getProductList() {
  return this.http.get(environment.apiUrl + "/Product/getProductList");
}

getProductById(locationId: string) {
  return this.http.get(environment.apiUrl + "/Product/getProductById/" + locationId);
}

updateProductById(data: {}) {
  return this.http.put(environment.apiUrl + "/Product/updateProduct" , data);
}


deleteProductById(id: string) {
  return this.http.delete(environment.apiUrl + "/Product/deleteProductById/" + id, {});
}
  updateProviderProfileById(data: any) {
    return this.http.put(environment.apiUrl + "/ProviderProfile/updateProviderProfile/" , data);
  }

  getPrescriptionPreferences() {
    return this.http.get(environment.apiUrl + "/PrescriptionPreferences/getPrescriptionPreferences");
  }
  updatePrescriptionPreferences(data: {}) {
    return this.http.put(environment.apiUrl + "/PrescriptionPreferences/updatePrescriptionPreferences", data);
  }

  getLabList() {
    return this.http.get(environment.apiUrl + "/LabDetails/getLabList");
  }

  addNewLab(data: {} | null) {
    return this.http.post(environment.apiUrl + "/LabDetails/addNewLab", data);
  }
  getLabById(id: any) {
    return this.http.get(environment.apiUrl + "/LabDetails/getLabById/" + id);
  }
  updateLabById(data: {}) {
    return this.http.put(environment.apiUrl + "/LabDetails/updateLabDetails", data);
  }
  deleteLabById(id: any) {
    return this.http.delete(environment.apiUrl + "/LabDetails/deleteLabById/" + id);
  }

  // calendar settings apis

  getProviderCalendarList() {
    const url = environment.apiUrl + `/CalendarSetting/getProviderCalendarList`;
    return this.http.get(url);
  }
  getProviderCalendarById(providerId: string) {
    const url = environment.apiUrl + `/CalendarSetting/getProviderCalendarById/${providerId}`;
    return this.http.get(url);
  }
  updateProviderCalendar(requestBody: any) {
    const url = environment.apiUrl + `/CalendarSetting/updateProviderCalendar`;
    return this.http.put(url, requestBody);
  }
  getReceiptSettings() {
    return this.http.get(environment.apiUrl + "/ReceiptSettings/getReceiptSettings");
  }

  updateReceiptSettings(data: {}) {
    return this.http.put(environment.apiUrl + "/ReceiptSettings/updateReceiptSettings", data);
  }
  staffTimeOffCreate(data: {}) {
    return this.http.post(environment.apiUrl + "/CalendarSetting/createStaffTimeOff", data);
  }
  staffTimeOffUpdate(data: {}) {
    return this.http.put(environment.apiUrl + "/CalendarSetting/updateStaffTimeOff", data);
  }
  getStaffTimeOffList() {
    return this.http.get(environment.apiUrl + "/CalendarSetting/getStaffTimeOffList");
  }
  getStaffTimeOffById(id) {
    return this.http.get(environment.apiUrl + `/CalendarSetting/getStaffTimeOffById/${id}`);
  }
  getTimeZone() {
    return this.http.get(`https://timeapi.io/api/TimeZone/AvailableTimeZones`);
  }

  // patient Api
  patientCreateApi(data: any) {
    console.log(data);
    return this.http.post(environment.apiUrl + "/patient/createPatient", data);
  }
  AllpatientApi() {
    return this.http.get(environment.apiUrl + "/Patient/getAllPatientList");
  }
  patientDeleteApi(id: any) {
    return this.http.delete(environment.apiUrl + "/Patient/deletePatient/" + id);
  }
  patientGetById(id: any) {
    return this.http.get(environment.apiUrl + "/patient/getPatientByID/" + id)
  }
  patientUpdateById(data: any) {
    return this.http.put(environment.apiUrl + "/patient/updatePatient", data);
  }

  getHolidayList() {
    return this.http.get(environment.apiUrl + "/CalendarSetting/getPracticeHolidayList");
  }

  createPracticeHoliday(data: any) {
    return this.http.post(environment.apiUrl + "/CalendarSetting/createPracticeHoliday", data);
  }

  deletePracticeHoliday(id: any) {
    return this.http.delete(environment.apiUrl + "/CalendarSetting/deletePracticeHoliday/" + id);
  }

  deleteStaffTimeOff(id: any) {
    return this.http.delete(environment.apiUrl + "/CalendarSetting/deleteStaffTimeOff/" + id);
  }

  createGeneralCalendarSetting(data:any){
    return this.http.post(environment.apiUrl + "/CalendarSetting/createGeneralCalendarSetting", data);
  }

  getGeneralCalendarSetting(){
    return this.http.get(environment.apiUrl + "/CalendarSetting/getGeneralCalendarSetting");
  }
  getPatientVitalsList(id: any){
    return this.http.get(environment.apiUrl + "/PatientVitals/getPatientVitalsList/" + id);
  }
  createPatientVitals(data:any){
    return this.http.post(environment.apiUrl + "/PatientVitals/createPatientVitals", data);
  }
}