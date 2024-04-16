import { Component } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { routes } from "src/app/shared/routes/routes";
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-customers',
  standalone: true,
  imports: [RouterModule,ReactiveFormsModule,DropdownModule,CommonModule],
  templateUrl: './edit-customers.component.html',
  styleUrl: './edit-customers.component.scss'
})
export class EditCustomersComponent {
  editCustomerGroup:UntypedFormGroup
  routes = routes;

  wareHouseArray = [
    {name:'Electronifly'},
    {name:'Warehouse Gas'},
  ]

  statusArray = [
    {name:'Enabled'},
    {name:'Disabled'},
  ]
  constructor( private fb: UntypedFormBuilder,) {
    this.editCustomerGroup = this.fb.group({
      wareHouse:['',[Validators.required]],
      name:['',[Validators.required]],
      phoneNumber: ['', [Validators.required,Validators.pattern(new RegExp(/^.{3,20}$/))],],
      email:['',[Validators.required,Validators.email]],
      status:['',[Validators.required]],
      password:['', [Validators.required, Validators.pattern(new RegExp(/^.{3,20}$/))],],
      taxNumber:['',[]],
      openingBalance:['',[]],
      creditPeriod:['',[]],
      creditLimit:['',[]],
      billingAddress:['',[]],
      shippingAddress:['',[]],
    })
  }



  editCustomerForm(){
    console.log(this.editCustomerGroup.value);

  }
}
