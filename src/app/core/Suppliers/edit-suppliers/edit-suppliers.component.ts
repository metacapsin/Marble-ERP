import { Component } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { routes } from "src/app/shared/routes/routes";
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-suppliers',
  standalone: true,
  imports: [RouterModule,ReactiveFormsModule,DropdownModule,CommonModule],
  templateUrl: './edit-suppliers.component.html',
  styleUrl: './edit-suppliers.component.scss'
})
export class EditSuppliersComponent {
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
