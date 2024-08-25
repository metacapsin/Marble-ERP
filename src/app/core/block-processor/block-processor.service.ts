import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})

export class blockProcessorService {
  constructor(private http: HttpClient) { }
  // block Processor APIS
  creatBlockProcessor(data: any) {
    return this.http.post(environment.apiUrl + '/BlockProcessorController/createBlockProcessor', data);
  }
  getAllBlockProcessorData() {
    return this.http.get(environment.apiUrl + '/BlockProcessorController/getAllBlockProcessor');
  }
  getBlockProcessorDataById(id: any) {
    return this.http.get(environment.apiUrl + `/BlockProcessorController/getBlockProcessorById/${id}`);
  }

  updateBlockProcessorData(data: any) {
    return this.http.put(environment.apiUrl + '/BlockProcessorController/updateBlockProcessor', data);
  }
  DeleteBlockProcessor(id: any){
    return this.http.delete(environment.apiUrl + `/BlockProcessorController/deleteBlockProcessor/${id}`);
  }

  getSlabsByProcessorId(id: any) {
    return this.http.get(environment.apiUrl + `/SlabProcessingController/getSlabsByProcessorId/${id}`);
  }

  // ----slab Processing Api's ------ 

  addSlabProcessing(data: any) {
    return this.http.post(environment.apiUrl + '/SlabProcessingController/addSlabProcessing', data);
  }
  getAllSlabProcessing(id: any) {
    return this.http.get(environment.apiUrl + `/SlabProcessingController/getAllSlabProcessing/${id}`);
  }
  getSlabProcessingById(id: any) {
    return this.http.get(environment.apiUrl + `/SlabProcessingController/getSlabProcessingById/${id}`);
  }

  updateSlabProcessing(data: any) {
    return this.http.put(environment.apiUrl + '/SlabProcessingController/updateSlabProcessing', data);
  }
  deleteSlabProcessing(id: any){
    return this.http.delete(environment.apiUrl + `/SlabProcessingController/deleteSlabProcessing/${id}`);
  }

  // ----slab Processing payment Api's ------ 

  createPayment(data: any) {
    return this.http.post(environment.apiUrl + '/SlabProcessingController/createPayment', data);
  }
  getPaymentDetailById(id: any) {
    return this.http.get(environment.apiUrl + `/SlabProcessingController/getPaymentDetailById/${id}`);
  }
  getPaymentListByProcessorId(id: any) {
    return this.http.get(environment.apiUrl + `/SlabProcessingController/getPaymentListByProcessorId/${id}`);
  }

  deletePayment(id: any){
    return this.http.delete(environment.apiUrl + `/SlabProcessingController/deletePayment/${id}`);
  }



}