import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment.development";

@Injectable({
  providedIn: "root",
})
export class TaxVendorsService {
  constructor(private http: HttpClient) {}
  createTaxVendor(data: any) {
    return this.http.post(
      environment.apiUrl + `/TaxVendorController/createTaxVendor`,
      data
    );
  }
  getTaxVendorList() {
    return this.http.get(
      environment.apiUrl + `/TaxVendorController/getTaxVendorList`
    );
  }
  getVendorSalesList(id: any) {
    return this.http.get(
      environment.apiUrl + `/TaxVendorController/getVendorSalesList/${id}`
    );
  }
  getVendorPurchasesList(id: any) {
    return this.http.get(
      environment.apiUrl + `/TaxVendorController/getVendorPurchasesList/${id}`
    );
  }
  getTaxVendorById(id: any) {
    return this.http.get(
      environment.apiUrl + `/TaxVendorController/getTaxVendorById/${id}`
    );
  }

  updateTaxVendor(data: any) {
    return this.http.put(
      environment.apiUrl + `/TaxVendorController/updateTaxVendor`,
      data
    );
  }
  deleteTaxVendor(id: any) {
    return this.http.delete(
      environment.apiUrl + `/TaxVendorController/deleteTaxVendor/${id}`
    );
  }
  createTaxVendorPayment(data: any) {
    return this.http.post(
      environment.apiUrl + `/TaxVendorController/createTaxVendorPayment`,
      data
    );
  }
  createPurchaseTaxVendorPayment(data: any) {
    return this.http.post(
      environment.apiUrl + `/TaxVendorController/createPurchaseTaxVendorPayment`,
      data
    );
  }
  getPaymentListByVendorId(id: any) {
    return this.http.get(
      environment.apiUrl + `/TaxVendorController/getPaymentListByVendorId/${id}`
    );
  }
  getPurchasePaymentListByVendorId(id: any) {
    return this.http.get(
      environment.apiUrl + `/TaxVendorController/getPurchasePaymentListByVendorId/${id}`
    );
  }
  getPaymentDetailById(id: any) {
    return this.http.get(
      environment.apiUrl + `/TaxVendorController/getPaymentDetailById/${id}`
    );
  }
  getPaymentList() {
    return this.http.get(
      environment.apiUrl + `/TaxVendorController/getPaymentList`
    );
  }

  deletePayment(id: any) {
    return this.http.delete(
      environment.apiUrl + `/TaxVendorController/deletePayment/${id}`
    );
  }
  deletePurchaseTaxVendorPayment(id: any) {
    return this.http.delete(
      environment.apiUrl + `/TaxVendorController/deletePurchaseTaxVendorPayment/${id}`
    );
  }
}