import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { TabViewModule } from 'primeng/tabview';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-documents-list',
  templateUrl: './documents-list.component.html',
  styleUrl: './documents-list.component.scss',
  standalone: true,
  imports: [CommonModule, SharedModule, TabViewModule, ButtonModule, DialogModule, CalendarModule, DropdownModule]
})
export class DocumentsListComponent {
  uploadDocumentsForm : FormGroup;
  uploadDocumentsDialog = false;
  searchDataValue = "";
  selectedProducts = [];
  documentsList = [
    {
      documentsDate: "2024-03-25",
      documentsName: "Medical Report",
      documentsStatus: "Completed",
      documentsLabel: "Confidential",
      documentsNotes: "Patient has recovered fully.",
      documentsSentPatient: "Yes",
    },
    {
      documentsDate: "2024-03-24",
      documentsName: "Prescription",
      documentsStatus: "Pending",
      documentsLabel: "Urgent",
      documentsNotes: "Medication for flu symptoms.",
      documentsSentPatient: "No",
    },
    {
      documentsDate: "2024-03-23",
      documentsName: "Lab Results",
      documentsStatus: "Completed",
      documentsLabel: "Normal",
      documentsNotes: "All test results within normal range.",
      documentsSentPatient: "Yes",
    },
    {
      documentsDate: "2024-03-22",
      documentsName: "Consent Form",
      documentsStatus: "Completed",
      documentsLabel: "Legal",
      documentsNotes: "Patient consented to surgery.",
      documentsSentPatient: "No",
    },
    {
      documentsDate: "2024-03-21",
      documentsName: "Billing Statement",
      documentsStatus: "Pending",
      documentsLabel: "Financial",
      documentsNotes: "Pending insurance approval.",
      documentsSentPatient: "Yes",
    }
  ];
    

  constructor(public fb: FormBuilder){
    this.uploadDocumentsForm = this.fb.group({
      documentsUpload: ['']
    })
  }
  
  public searchData(value: any): void {
    // this.problemsList = this.problemsList.map(i => {
    //   if (i.allergyAllergen.toLowerCase().includes(value.trim().toLowerCase())) {
    //     return i;
    //   }
    // });
  }

  uploadDocumentsFormSubmit(){
    if (this.uploadDocumentsForm.valid) {
      this.uploadDocumentsDialog = false;
      console.log("Form is valid");
      console.log(this.uploadDocumentsForm.value);


    }
    else {
      console.log("Form is invalid");

    }
  }
}
