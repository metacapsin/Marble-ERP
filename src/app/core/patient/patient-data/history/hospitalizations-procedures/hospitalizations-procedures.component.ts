import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { TabViewModule } from 'primeng/tabview';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { Router } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { SettingsService } from 'src/app/shared/data/settings.service';

@Component({
  selector: 'app-hospitalizations-procedures',
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
  templateUrl: './hospitalizations-procedures.component.html',
  styleUrl: './hospitalizations-procedures.component.scss',
})
export class HospitalizationsProceduresComponent implements OnInit{
  formGroup: FormGroup;
  formGroupSecond: FormGroup;
  formGrouphospice: FormGroup;
  Related:any
  status:any

  ngOnInit(): void {
    this.Related = [{ name: 'mother' }, { name: 'father' }, { name: 'son' }];
    this.status = [{ status: 'Completed' }, { status: 'Active' },{ status: 'Aborted' }, { status: 'Canceled' },{ status: 'Scheduled' },];
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
      related: [null, [Validators.required]],
      lengthofstay: [null, [Validators.required]],
      procedure: [null, [Validators.required]],
      states: [null, [Validators.required]],
      comments: [null, [Validators.required]],
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
