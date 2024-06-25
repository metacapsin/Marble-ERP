import { Injectable } from '@angular/core';
import { Observable, forkJoin, map } from 'rxjs';
import { PaymentInService } from 'src/app/core/payment-in/payment-in.service';
import { PaymentOutService } from 'src/app/core/payment-out/payment-out.service';

@Injectable({
  providedIn: 'root'
})
export class CombinedPaymentService {

  constructor(
    private paymentInService: PaymentInService,
    private paymentOutService: PaymentOutService
  ) {}

  getCombinedPayments(): Observable<any[]> {
    return forkJoin([
      this.paymentInService.getPaymentList(),
      this.paymentOutService.getPurchasePaymentList()
    ]).pipe(
      map(([paymentsInResponse, paymentsOutResponse]) => {
        const paymentsIn = this.extractPayments(paymentsInResponse);
        const paymentsOut = this.extractPayments(paymentsOutResponse);
        console.log(paymentsInResponse,paymentsOutResponse)
        return [...paymentsIn, ...paymentsOut].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      })
    );
  }

  private extractPayments(response: any): any[] {
    // Adjust this method to extract the array of payments from the response object
    if (Array.isArray(response)) {
      return response;
    } else if (response.payments) {
      return response.payments;
    } else if (response.data) {
      return response.data;
    } else {
      console.error('Unexpected response format', response);
      return [];
    }
  }
}