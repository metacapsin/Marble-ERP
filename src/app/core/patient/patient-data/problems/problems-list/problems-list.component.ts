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

interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

@Component({
  selector: 'app-problems-list',
  templateUrl: './problems-list.component.html',
  styleUrl: './problems-list.component.scss',
  standalone: true,
  imports: [SharedModule, DialogModule, CommonModule, RadioButtonModule, AutoCompleteModule, CalendarModule, CheckboxModule, MatPaginatorModule, MatButtonModule, MatIconModule, RouterModule, ButtonModule, FormsModule, ConfirmDialogComponent, ShowHideDirective],
})
export class ProblemsListComponent {
  addProblemsDialog = false;

  problemsForm!: FormGroup;
  patientId = ""
  status!: string;
  usersApiData: any;
  searchDataValue = "";
  selectedProducts = [];
  minSelectableDate: Date;
  minSelectableTime: string;
  isActive: boolean = true;
  suggestions: any[] | undefined;

  public showDialog: boolean = false;
  modalData: any = {}
  problemID: any;
  problemsList = [
    {
      problemIssue: "Fever",
      problemICD10: "ABC",
      problemICD9: "ICD",
      problemStartDate: "MAR 14 2024",
    },

    {
      problemIssue: "Cold",
      problemICD10: "YYY",
      problemICD9: "",
      problemStartDate: "MAR 15 2024",
    },
    {
      problemIssue: "Seek",
      problemICD10: "ICD10",
      problemICD9: "ICD9",
      problemStartDate: "MAR 14 2024",
    },

    {
      problemIssue: "Cold",
      problemICD10: "ICD",
      problemICD9: "",
      problemStartDate: "MAR 15 2024",
    },
    {
      problemIssue: "Seek",
      problemICD10: "ICD10",
      problemICD9: "ICD9",
      problemStartDate: "MAR 14 2024",
    },

    {
      problemIssue: "Cold",
      problemICD10: "ICD",
      problemICD9: "",
      problemStartDate: "MAR 15 2024",
    }
  ];

  search(event: AutoCompleteCompleteEvent) {
    this.suggestions = [...Array(10).keys()].map(item => event.query + '-' + item);
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder) {
    this.problemsForm = this.fb.group({
      problemStatus: ['', Validators.required],
      problemIssue: ['', Validators.required],
      problemICD10: ['', Validators.required],
      problemICD9: [''],
      problemType: ['', Validators.required],
      problemStartDate: ['', Validators.required],
      problemEndDate: [''],
      ProblemComments: [''],
    })

  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.patientId = params['id'];
      console.log("patient id in problems",this.patientId);
    });

  }


  deleteProblem(_id: any) {
    this.problemID = _id;

    this.modalData = {
      title: "Delete",
      messege: "Are you sure want to delete this Problem",
    }
    this.showDialog = true;
  }
  callBackModal() {
    // this.service.deleteProblemById(this.problemID).subscribe(resp => {
    //   const message = "Service Location has been deleted"
    //   this.getServiceLocationList();
    //   this.showDialog = false;

    // })
  }

  close() {
    this.showDialog = false;
  }

  public searchData(value: any): void {
    // this.problemsList = this.problemsList.map(i => {
    //   if (i.problemIssue.toLowerCase().includes(value.trim().toLowerCase())) {
    //     return i;
    //   }
    // });
  }

  openAddProblems() {
    this.addProblemsDialog = true;
  }

  problemsFormSubmit() {
    if (this.problemsForm.valid) {
      this.addProblemsDialog = false;
      console.log("Form is valid");
      console.log(this.problemsForm.value);
      this.problemsForm.value.patientId = this.patientId;
    }
    else {
      console.log("Form is invalid");
    }
  }

  public sortData(sort: Sort) {
    const data = this.problemsList.slice();

    if (!sort.active || sort.direction === '') {
      this.problemsList = data;
    } else {
      this.problemsList = data.sort((a, b) => {
        const aValue = (a as any)[sort.active];
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }
}
