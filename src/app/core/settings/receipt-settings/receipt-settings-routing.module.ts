import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReceiptSettingsComponent } from './receipt-settings/receipt-settings.component';

const routes: Routes = [{ path: '', component: ReceiptSettingsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReceiptSettingsRoutingModule { }
