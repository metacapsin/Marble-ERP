import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { BehaviorSubject, Subject } from 'rxjs';
import { an } from '@fullcalendar/core/internal-common';

@Injectable({
  providedIn: 'root',
})

export class NewPurchaseService {
    public slabDetailsLength = new BehaviorSubject<number>(0);

  constructor(private http: HttpClient) { }
  // Purchase APIS
  createPurchase(data: any) {
    return this.http.post(environment.apiUrl + '/Purchase/createPurchase', data);
  }
  getPurchaseList(data: any) {
    return this.http.post(environment.apiUrl + '/Purchase/getPurchaseList', data);
  }
  getPurchaseById(id: any) {
    return this.http.get(environment.apiUrl + `/Purchase/getPurchaseById/${id}`);
  }
  UpdatePurchaseData(data: any) {
    return this.http.put(environment.apiUrl + '/Purchase/updatePurchase', data);
  }
  deletePurchase(id: any){
    return this.http.delete(environment.apiUrl + `/Purchase/deletePurchase/${id}`);
  }

  
  getPurchaseBySupplierId(id: any){//all Purchase by Supplier id paid or unpaid both 
    return this.http.get(environment.apiUrl + `/Purchase/getPurchaseBySupplierId/${id}`);
  }
  getPendingPurchaseBySupplierId(id: any){//all Purchase by Supplier id paid or unpaid both 
    return this.http.get(environment.apiUrl + `/Purchase/getPendingPurchaseBySupplierId/${id}`);
  }

  getPurchaseWithSlabDetail(id: any){//all Purchase by Supplier id paid or unpaid both 
    return this.http.get(environment.apiUrl + `/Purchase/getPurchaseWithSlabDetail/${id}`);
  }

  generateProductCode(data: any) {
    return this.http.post(environment.apiUrl + '/Purchase/generateProductCode', data);
  }

  generateBarCode(data: any) {
    return this.http.post(environment.apiUrl + '/Product/generate-barcode', data);
  }

  // getPurchasePaymentList(id: any){
  //   return this.http.get(environment.apiUrl + `/Purchase/getPurchasePaymentList/${id}`);
  // }





  //////////////////for handling data///////////

  private formData: any = {};

  setFormData(key: string, value: any) {
    this.formData[key] = value;
  }

  getFormData(key: string) {
    return this.formData[key];
  }
  clearFormData() {
    this.formData = {};
  }

  slabDetailsLengthCount(length: number) {
    this.slabDetailsLength.next(length); // Update value
  }

  // private formDataSubject = new Subject<any>();
  // private formDataSubject = new BehaviorSubject<any>(null);

  // formData$ = this.formDataSubject.asObservable();

  // setFormData(payload: any) {
  //   this.formDataSubject.next(payload);
  // }

  // getFormData() {
  //   let formData;
  //   this.formData$.subscribe(value => formData = value);
  //   return formData;
  //   }


    // private stepOneData: any = {};
    // private stepTwoData: any = {};
  
    // setStepOneData(data: any) {
    //   this.stepOneData = data;
    // }
  
    // getStepOneData() {
    //   return this.stepOneData;
    // }
  
    // setStepTwoData(data: any) {
    //   this.stepTwoData = data;
    // }
  
    // getStepTwoData() {
    //   return this.stepTwoData;
    // }
  
    // getAllData() {
    //   return {
    //     ...this.stepOneData,
    //     ...this.stepTwoData
    //   };
    // }
}