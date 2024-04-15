import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarSettingsHomeComponent } from './calendar-settings-home/calendar-settings-home.component';

const routes: Routes = [
  { path: '', component: CalendarSettingsHomeComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CalendarSettingsRoutingModule { }
