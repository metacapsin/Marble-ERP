import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-order-now-form',
  templateUrl: './order-now-form.component.html',
  styleUrl: './order-now-form.component.scss',
  standalone: true,
  imports: [CommonModule, SharedModule, DropdownModule, CalendarModule],
})
export class OrderNowFormComponent {

  orderNowForm : FormGroup;
 provider = [{
  label:'M D Care Provider', value:''
 }]

 constructor(private fb: FormBuilder){
  this.orderNowForm = this.fb.group({
    orderNowVaccineName : [''],
    orderNowVaccineType: [''],
    orderNowOrderedDate: [''],
    orderNowProviderName: ['']
  })
 }

  orderNowFormSubmit(){

  }

}
