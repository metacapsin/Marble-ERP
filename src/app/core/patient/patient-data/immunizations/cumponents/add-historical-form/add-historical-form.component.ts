import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-add-historical-form',
  templateUrl: './add-historical-form.component.html',
  styleUrl: './add-historical-form.component.scss',
  standalone: true,
  imports: [CommonModule, SharedModule, CalendarModule, DropdownModule],
})
export class AddHistoricalFormComponent {
  addHistoricalForm : FormGroup


  Provider=[{
    label:'', value:''
  }];
  
  InformationSource=[{
    label:'', value:''
  }];

  constructor(private fb: FormBuilder){
    this.addHistoricalForm = this.fb.group({
      addHistoricalVaccineName: [''],
      addHistoricalVaccineType: [''],
    })
  }
  addHistoricalFormSubmit(){

  }
}
