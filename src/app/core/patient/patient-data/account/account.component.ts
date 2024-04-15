import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { TabViewModule } from 'primeng/tabview';
import { DialogModule } from 'primeng/dialog';
import { SelectButtonModule } from 'primeng/selectbutton';
// import { FormsModule } from 'src/app/core/forms/forms.module';
// import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-account',
  standalone: true,
  imports: [
    RouterModule,
    TabViewModule,
    CommonModule,
    DropdownModule,
    CalendarModule,
    DialogModule,
    ReactiveFormsModule,
    SelectButtonModule,
    // SharedModule,
    FormsModule
  ],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss',
})
export class AccountComponent implements OnInit {
  Type: any[] = [];
  Provider: any = [];
  visible = false;
  stateOptions: any[] = [{label: 'Off', value: 'off'}, {label: 'On', value: 'on'}];
  dropdownSecond:any
  dropdownFirst:any;
  SelectButton = 'off';
  formGroup:UntypedFormGroup
  guarantorArray:any
  statesArray:any
  startDate:any
  toDate:any
  

  showDialog() {
    this.visible = true;
  }

  ngOnInit() {
    this.Type = ['A','B' , 'BO', 'O' ];
    this.Provider = [{ name: '+ve' }, { name: '_ve' }];
    this.guarantorArray = ['Child','Spouse','Other']
    this.statesArray = [
      'AL', 'AK', 'AZ', 'AR', 'CA', 'CZ', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME',
      'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'PR',
      'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'VI', 'WA', 'WV', 'WI', 'WY', 'PI', 'HI', 'AA', 'AE', 'AP', 'AS', 'FM', 'GU', 'MH'
    ];
    
  }
  history = [
    { label: 'lastDiagnosis', name: 'None' },
    { label: 'lastVisit', name: 'None' },
    { label: 'lastStatement', name: 'None' },
    { label: 'lastPayment', name: 'None' },
  ];
  financialInformation = [
    { label: 'Expected Charges', amount: '$0.00' },
    { label: 'Adjustments', amount: '$0.00' },
    { label: 'Receipts', amount: '$0.00' },
    { label: 'Patient Balance', amount: '$0.00' },
    { label: 'Insurance Balance', amount: '$0.00' },
    { label: 'Unapplied', amount: '$0.00' },
    { label: 'Total Balance', amount: '$0.00' },
  ];

  eligibility = [
    { label: 'PBM', name: 'CVS|CAREMARK' },
    { label: 'Rx PCN', name: '610502' },
    { label: 'Last Checked', name: 'None' },
    // { label: 'lastPayment', name: 'None' },
  ];

  Pharmacy = [
    { label: 'Mail Fulfillment Pharmacy', name: 'CVS Caremark MAILSERVICE Pharmacy' },
    { label: 'Retail', name: 'Covered' },
    { label: 'Specialty', name: 'N/A' },
    { label: 'Long Term Care', name: 'N/A' },
    { label: 'Mail Order', name: 'Covered' },

  ];

  Mismatched = [  
    { label: 'Address', name: '239 E CENTRAL PKWY, MOUNTAIN HOUSE, CA 95391' },
    { label: 'Gender', name: 'M' },
  ];



  constructor(private fb:UntypedFormBuilder){
    this.formGroup = this.fb.group({
      guarantor:[''],
      firstName:[''],
      lastName:[''],
      streetAddress:['', [ Validators.pattern(new RegExp(/^.{5,50}$/))]],
      apt_Suite:[''],
      city:['', [ Validators.pattern(new RegExp(/^.{5,50}$/))]],
      state:[''],
      ZIP:['', [Validators.pattern(new RegExp(/^\d{5}(?:-\d{4})?$/))]],
    })
  }
  submitFrom(){
    console.log(this.formGroup.value)
  }
  

  // #e9efee
}
