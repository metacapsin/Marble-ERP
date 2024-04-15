import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { TabViewModule } from 'primeng/tabview';
import { SettingsService } from 'src/app/shared/data/settings.service';

@Component({
  selector: 'app-hospice',
  standalone: true,
  imports: [
    TabViewModule,
    ReactiveFormsModule,
    ButtonModule,
    CommonModule,
    FormsModule,
    CalendarModule,
    DropdownModule,
  ],
  templateUrl: './hospice.component.html',
  styleUrl: './hospice.component.scss'
})
export class HospiceComponent {
  formGroup: FormGroup;
  formGroupSecond: FormGroup;
  formGrouphospice: FormGroup;
  Related:any
  status:any
  PriorEvent:any
  discharge:any

  ngOnInit(): void {
    this.Related = [{ name: 'mother' }, { name: 'father' }, { name: 'son' }];
    this.status = [{ status: 'InActive' }, { status: 'Active' }];
    this.PriorEvent = [{ name: 'Hospital Admission' }, { name: 'Outpatient Visit' }];
    this.discharge = [{name:'Discharge to Healthcare Facility'},{name:'Discharge to Home'}]
  }
  constructor(private fb: FormBuilder, private router: Router,private service: SettingsService) {
    this.formGroup = this.fb.group({
      hospitalizations: this.fb.array([]),
    });
    this.formGroupSecond = this.fb.group({
      facility: this.fb.array([]),
    });
    this.formGrouphospice = this.fb.group({
      hospice: this.fb.array([]),
    });
  }
  submitFrom() {
    console.log('form', this.formGroup.value.hospitalizations);
  }
  // first Form
  addEducationItem() {
    const item = this.fb.group({
      admissionDate: [null, [Validators.required]],
      related: [null,],
      lengthofstay: [null, [Validators.required]],
      procedure: [null,],
      states: [null,],
      comments: [null,],
    });
    this.hospitalizations.push(item);
  }
  get hospitalizations() {
    return this.formGroup.controls['hospitalizations'] as FormArray;
  }
  deleteEducation(Index: number) {
    this.hospitalizations.removeAt(Index);
  }
  // form Second
  addfacilityItem() {
    const item = this.fb.group({
      longadmissionDate: [null, [Validators.required]],
      facilityName: [null, [Validators.required]],
      dischargeData: [null, [Validators.required]],
      secondComments: [null, [Validators.required]],
    });
    this.facility.push(item);
  }
  get facility() {
    return this.formGroupSecond.controls['facility'] as FormArray;
  }
  deletefacility(Index: number) {
    this.facility.removeAt(Index);
  }
  formGroupSecondSubmit() {
    console.log('form', this.formGroupSecond.value.facility);
  }
  // foem therd
  addHospiceItem() {
    const item = this.fb.group({
      hospiceadmissionDate: [null, [Validators.required]],
      priorEvent: [null, [Validators.required]],
      discharge: [null, [Validators.required]],
      therdComments: [null, [Validators.required]],
    });
    this.hospice.push(item);
  }
  get hospice() {
    return this.formGrouphospice.controls['hospice'] as FormArray;
  }
  deleteHospice(Index: number) {
    this.hospice.removeAt(Index);
  }
  formGrouphospiceSubmit() {
    console.log('form', this.formGrouphospice.value.hospice);
  }

  goBack() {
    window.history.back()
  }
}
