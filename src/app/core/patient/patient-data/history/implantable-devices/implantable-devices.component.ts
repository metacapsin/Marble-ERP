import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { SettingsService } from 'src/app/shared/data/settings.service';

@Component({
  selector: 'app-implantable-devices',
  standalone: true,
  imports: [ReactiveFormsModule,ButtonModule,CommonModule,DropdownModule,],
  templateUrl: './implantable-devices.component.html',
  styleUrl: './implantable-devices.component.scss'
})
export class ImplantableDevicesComponent implements OnInit{
  formGroup!:UntypedFormGroup;
  status:any;
  constructor(private fb:UntypedFormBuilder) {
    this.formGroup = this.fb.group({
      ImplantableDevices: this.fb.array([]),
    })
  }
  goBack(){
    window.history.back();
  }
  submitFrom(){
    console.log(this.formGroup.value);
  }
ngOnInit(): void {
  this.status = [{ status: 'InActive' }, { status: 'Active' }];
}
  // form Second
  addImplantableDevicesItem() {
    const item = this.fb.group({
      states: [null,],
      UDI: [null,],
      Comments: [null,],
    });
    this.ImplantableDevices.push(item);
  }
  get ImplantableDevices() {
    return this.formGroup.controls['ImplantableDevices'] as FormArray;
  }
  deleteImplantableDevices(Index: number) {
    this.ImplantableDevices.removeAt(Index);
  }
}