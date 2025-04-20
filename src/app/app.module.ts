import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors } from '@angular/common/http';
import { JwtInterceptor } from './shared/interceptor/jwt.interceptor';
import { ErrorInterceptor } from './shared/interceptor/error.interceptor';
import { StoreModule } from '@ngrx/store';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { WarehouseRoutingModule } from './core/settings/warehouse/warehouse-routing.module';
import { ProductsRoutingModule } from './core/settings/products/products-routing.module';
import { ProductsModule } from './core/settings/products/products.module';
import { IndianCurrencyPipe } from './shared/directives/indian-currency.pipe';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    ConfirmDialogModule,
    WarehouseRoutingModule,
    ProductsRoutingModule,
    ProductsModule
  ],
  providers: [
    IndianCurrencyPipe,
    ConfirmationService,
    provideHttpClient(withInterceptors(
      [JwtInterceptor]
    )),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
