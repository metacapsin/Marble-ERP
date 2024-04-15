import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedModule } from 'src/app/shared/shared.module';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { SettingsService } from 'src/app/shared/data/settings.service';
import { routes } from 'src/app/shared/routes/routes';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-prescription-preference',
  templateUrl: './prescription-preference.component.html',
  styleUrls: ['./prescription-preference.component.scss'],
  standalone: true,
  imports: [CommonModule,
    SharedModule,
    CheckboxModule,
    DropdownModule,
    ToastModule],
    providers: [MessageService]
})
export class PrescriptionPreferenceComponent {
  public routes = routes;
  loading = false;
  PrescriptionForm!: FormGroup;
  DrugIteraction = [
    { label: "Major Drug Interaction", value: "Major Drug Interaction " },
    { label: "Minor Drug Interaction", value: "Minor Drug Interaction " },
    { label: "Moderate Drug Interaction", value: "Moderate Drug Interaction " }
  ];
  selectedDrugIteraction = "";

  DrugAllergy = [
    { label: "Severe", value: "Severe" },
    { label: "Moderate", value: "Moderate" },
    { label: "Mild", value: "Mild" }
  ]
  selectedDrugAllergy= ""
  constructor(private fb: FormBuilder, private _snackBar: MatSnackBar, private service: SettingsService, private messageService: MessageService) {
    this.PrescriptionForm = this.fb.group({
      overrideDrugToDrugAlertsWtdOverrideReason: [''],
      provideOverrideReasonForMultiDrugToDrugAlerts: [''],
      securityLevelForDrugToDrugInterectionAlerts: [''],
      displayDrugAllergyInterectionAlerts: [''],
      allowOverrideDrugAllergyInteractionAlertsWtdReason: [''],
      allowToProvideOneReasonForMultiDrugAllergyInterectionAlerts: [''],
      securityLevelForDrugToDrugAllergyAlerts: [''],
      priscriptionPrintingXAsix: ['',[Validators.pattern(/^\d+(\.\d+)?\s*(?:in|inch|inches)?$/)]],
      priscriptionPrintingYAsix: ['',[Validators.pattern(/^\d+(\.\d+)?\s*(?:in|inch|inches)?$/)]],
    });
  }

  ngOnInit(): void {
    this.getPrescriptionPreferencesData();
  }

  getPrescriptionPreferencesData() {
    this.loading = true;
    this.service.getPrescriptionPreferences().subscribe((resp: any) => {
      this.loading = false;
      this.PrescriptionForm.patchValue({
        overrideDrugToDrugAlertsWtdOverrideReason: resp.data[0].overrideDrugToDrugAlertsWtdOverrideReason,
        provideOverrideReasonForMultiDrugToDrugAlerts: resp.data[0].provideOverrideReasonForMultiDrugToDrugAlerts,
        securityLevelForDrugToDrugInterectionAlerts: resp.data[0].securityLevelForDrugToDrugInterectionAlerts,
        displayDrugAllergyInterectionAlerts: resp.data[0].displayDrugAllergyInterectionAlerts,
        allowOverrideDrugAllergyInteractionAlertsWtdReason: resp.data[0].allowOverrideDrugAllergyInteractionAlertsWtdReason,
        allowToProvideOneReasonForMultiDrugAllergyInterectionAlerts: resp.data[0].allowToProvideOneReasonForMultiDrugAllergyInterectionAlerts,
        securityLevelForDrugToDrugAllergyAlerts: resp.data[0].securityLevelForDrugToDrugAllergyAlerts,
        priscriptionPrintingXAsix: resp.data[0].priscriptionPrintingXAsix,
        priscriptionPrintingYAsix: resp.data[0].priscriptionPrintingYAsix

      })
    })
  }

  PrescriptionFormSubmit() {
    if (this.PrescriptionForm.valid) {
      this.service.updatePrescriptionPreferences(this.PrescriptionForm.value).subscribe((resp: any) => {
        if(resp.status === 'success'){
          console.log("Success", resp)
          const message = "Prescription Preference has been updated"
          this.messageService.add({ severity: 'success',  detail: message });
          this.getPrescriptionPreferencesData();
        }else{
          const message = resp.message
          this.messageService.add({ severity: 'error',  detail: message });
        }
        
      })
      console.log("Form is valid!");

    } else {
      console.log("Form is invalid!");
    }
  }
}
