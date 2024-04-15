import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-not-administered-form',
  templateUrl: './not-administered-form.component.html',
  styleUrl: './not-administered-form.component.scss',
  standalone: true,
  imports: [CommonModule, SharedModule, CalendarModule, DropdownModule, RadioButtonModule],
})
export class NotAdministeredFormComponent {
  notAdministeredForm : FormGroup;

  constructor(private fb: FormBuilder){
    this.notAdministeredForm = this.fb.group({
      notAdministeredVaccineName: [''],
      notAdministeredVaccineType: [''],
      notAdministeredReason: [''],
    })
  }

  notAdministeredFormSubmit(){

  }
}
