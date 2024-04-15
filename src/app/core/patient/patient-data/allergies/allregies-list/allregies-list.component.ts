import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { DialogModule } from 'primeng/dialog';
import { SharedModule } from 'src/app/shared/shared.module';
import { RadioButtonModule } from 'primeng/radiobutton';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { ShowHideDirective } from 'src/app/common-component/show-hide-directive/show-hide.directive';
import { ConfirmDialogComponent } from 'src/app/common-component/modals/confirm-dialog/confirm-dialog.component';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { DropdownModule } from 'primeng/dropdown';

interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}


@Component({
  selector: 'app-allregies-list',
  templateUrl: './allregies-list.component.html',
  styleUrl: './allregies-list.component.scss',
standalone: true,
  imports: [SharedModule, DialogModule, CommonModule, RadioButtonModule, AutoCompleteModule, CalendarModule, CheckboxModule, MatPaginatorModule, MatButtonModule, MatIconModule, RouterModule, ButtonModule, FormsModule, ConfirmDialogComponent, ShowHideDirective, DropdownModule],
})
export class AllregiesListComponent {
  addAllergyDialog = false;

  allergyForm!: FormGroup;
  patientId = ""
  status!: string;
  chronicisChecked: boolean = false;
  usersApiData: any;
  searchDataValue = "";
  selectedProducts = [];
  addVitalsDialog = false;
  minSelectableDate: Date;
  minSelectableTime: string;
  isActive: boolean = true;
  items: any[] | undefined;
  selectedItem: any;
  suggestions: any[] | undefined;

  public showDialog: boolean = false;
  modalData: any = {}
  allergyID: any;
  AllergiesList = [
    {
      allergyAllergen: "Fever",
      allergyReaction: "ABC",
      allergySeverities: "ICD",
      allergyDateOfOnset: "MAR 14 2024",
    },

    {
      allergyAllergen: "Cold",
      allergyReaction: "YYY",
      allergySeverities: "",
      allergyDateOfOnset: "MAR 15 2024",
    },
    {
      allergyAllergen: "Seek",
      allergyReaction: "ICD10",
      allergySeverities: "ICD9",
      allergyDateOfOnset: "MAR 14 2024",
    },

    {
      allergyAllergen: "Cold",
      allergyReaction: "ICD",
      allergySeverities: "",
      allergyDateOfOnset: "MAR 15 2024",
    },
    {
      allergyAllergen: "Seek",
      allergyReaction: "ICD10",
      allergySeverities: "ICD9",
      allergyDateOfOnset: "MAR 14 2024",
    },

    {
      allergyAllergen: "Cold",
      allergyReaction: "ICD",
      allergySeverities: "",
      allergyDateOfOnset: "MAR 15 2024",
    }
  ];

  severities = [
    {label:"Fatal", value:"Fatal"},
    {label:"Severe", value:"Severe"},
    {label:"Moderate to severe", value:"Moderate to severe"},
    {label:"Mild to moderate", value:"Mild to moderate"},
    {label:"Mild", value:"Mild"},
    {label:"Life threatening severity (qualifier value)", value:"Life threatening severity (qualifier value)"},
    {label:"sever", value:"sever"},
  ]

  search(event: AutoCompleteCompleteEvent) {
    this.suggestions = [...Array(10).keys()].map(item => event.query + '-' + item);
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder) {
    this.allergyForm = this.fb.group({
      allergyAllergen: ['', [Validators.required]],
      allergyReaction: ['', [Validators.required]],
      allergySeverities: ['', [Validators.required]],
      allergyDateOfOnset: ['', [Validators.required]],
      allergyComments: [''],
    })
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.patientId = params['id'];
      console.log("patient id in problems",this.patientId);
    });

  }


  deleteProblem(_id: any) {
    this.allergyID = _id;

    this.modalData = {
      title: "Delete",
      messege: "Are you sure want to delete this Problem",
    }
    this.showDialog = true;
  }

  showNewDialog() {
    this.showDialog = true;
  }

  callBackModal() {
    // this.service.deleteServiceLocationById(this.).subscribe(resp => {
    //   const message = "Service Location has been deleted"
    //   this._snackBar.open(message, '', {
    //     duration: 2000,
    //     verticalPosition: 'top',
    //     horizontalPosition: 'right',
    //     panelClass: "blue",
    //   });
    //   this.getServiceLocationList();
    //   this.showDialog = false;

    // })
  }

  close() {
    this.showDialog = false;
  }

  public searchData(value: any): void {
    // this.problemsList = this.problemsList.map(i => {
    //   if (i.allergyAllergen.toLowerCase().includes(value.trim().toLowerCase())) {
    //     return i;
    //   }
    // });
  }

  openAddAllergy() {
    this.addAllergyDialog = true;
  }

  allergyFormSubmit() {
    if (this.allergyForm.valid) {
      this.addAllergyDialog = false;
      console.log("Form is valid");
      console.log(this.allergyForm.value);


    }
    else {
      console.log("Form is invalid");

    }
  }

  public sortData(sort: Sort) {
    const data = this.AllergiesList.slice();

    if (!sort.active || sort.direction === '') {
      this.AllergiesList = data;
    } else {
      this.AllergiesList = data.sort((a, b) => {
        const aValue = (a as any)[sort.active];
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }
}

