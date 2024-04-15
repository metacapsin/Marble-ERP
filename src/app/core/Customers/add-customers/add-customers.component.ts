import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { routes } from "src/app/shared/routes/routes";

@Component({
  selector: 'app-add-customers',
  standalone: true,
  imports: [RouterModule,ReactiveFormsModule,DropdownModule,CommonModule],
  templateUrl: './add-customers.component.html',
  styleUrl: './add-customers.component.scss'
})
export class AddCustomersComponent {
  addcustomerGroup:UntypedFormGroup
  routes = routes;

  wareHouseArray = [
    'Electronifly',
    'Warehouse Gas',
  ]

  statusArray = [
    {name:'Enabled'},
    {name:'Disabled'},
  ]
  constructor( private fb: UntypedFormBuilder,) {
    this.addcustomerGroup = this.fb.group({
      // wareHouse:['',[Validators.required]],
      name:['',[Validators.required]],
      phoneNumber:['',[Validators.required]],
      email:['',[Validators.required,Validators.email]],
      // status:['',[Validators.required]],
      password:['', [Validators.required, Validators.pattern(new RegExp(/^.{1,50}$/))],],
      taxNumber:['',[]],
      openingBalance:['',[]],
      creditPeriod:['',[]],
      creditLimit:['',[]],
      billingAddress:['',[]],
      shippingAddress:['',[]],
    })
  }



  addcustomerForm(){
    console.log(this.addcustomerGroup.value);

  }
}
