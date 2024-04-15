import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-administer-new-form',
  templateUrl: './administer-new-form.component.html',
  styleUrl: './administer-new-form.component.scss',
  standalone: true,
  imports: [CommonModule, SharedModule, CalendarModule, DropdownModule, CheckboxModule],
})
export class AdministerNewFormComponent {
  adMinisterForm: FormGroup;

  Site=[{
    label:'', value:''
  }];

  Administered=[{
    label:'', value:''
  }];

  ServiceLocation=[{
    label:'', value:''
  }];
  
  Provider=[{
    label:'', value:''
  }];

  VisDate=[{
    label:'', value:''
  }];
  
  VfcFinancialClass=[{
    label:'', value:''
  }];
  
  VfcSource=[{
    label:'', value:''
  }];

  constructor( private fb: FormBuilder){
    this.adMinisterForm = this.fb.group({
      orderNowVaccineName : [''],
      orderNowVaccineType: [''],

    })
  }

  adMinisterFormSubmit(){

  }
}
