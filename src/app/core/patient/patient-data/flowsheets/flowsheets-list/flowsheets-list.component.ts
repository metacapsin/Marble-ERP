import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from 'src/app/core/forms/forms.module';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-flosheets-list',
  templateUrl: './flowsheets-list.component.html',
  styleUrl: './flosheets-list.component.scss',
  standalone: true,
  imports: [CommonModule, SharedModule, DropdownModule, CalendarModule,FormsModule],
})
export class FlosheetsListComponent{
  selectedflowsheets = "AdultPreventativeCareflowsheetslist";
  flowsheets = [
    {label:"Adult Preventative Care", value: "AdultPreventativeCareflowsheetslist"},
    {label:"Diabetes", value: "Diabetesflowsheetslist"},
    {label:"Hypertention", value: "Hypertentionflowsheetslist"},
    {label:"Vitals", value: "vitalsflowsheetslist"}
  ]

  AdultPreventativeCareflowsheetslist=[
    {title: "Blood Pressure (mmHg)", value: ""},
    {title: "Height/Length (ft-in)", value: ""},
    {title: "Weight (lbs-oz)", value: ""},
    {title: "BMI (kg/m²)", value: ""},
    {title: "WBC (x10E3/uL)", value: ""},
    {title: "RBC (x10E6/uL)", value: ""},
    {title: "Hemoglobin (g/dL)", value: ""},
    {title: "Hematocrit (%)", value: ""},
    {title: "MCV (fL)", value: ""},
    {title: "MCH (pg)", value: ""},
    {title: "MCHC (g/dL)", value: ""},
    {title: "RDW (%)", value: ""},
    {title: "Platelets (x10E3/uL)", value: ""},
    {title: "MPV (fL)", value: ""},
    {title: "NRBC (%)", value: ""},
    {title: "Glucose (mg/dL)", value: ""},
    {title: "BUN (mg/dL)", value: ""},
    {title: "Creatinine (mg/dL)", value: ""},
    {title: "eGFR (Non-African American) (mL/min/1.73)", value: ""},
    {title: "eGFR (African American) (mL/min/1.73)", value: ""},
    {title: "BUN/Creatinine (ratio)", value: ""},
    {title: "Sodium (mmol/L)", value: ""},
    {title: "Potassium (mmol/L)", value: ""},
    {title: "Chloride (mmol/L)", value: ""},
    {title: "Carbon Dioxide, Total (mmol/L)", value: ""},
    {title: "Calcium (mg/dL)", value: ""},
    {title: "Protein, Total (g/dL)", value: ""},
    {title: "Albumin (g/dL)", value: ""},
    {title: "Globulin, Total (g/dL)", value: ""},
    {title: "Albumin/Globulin (ratio)", value: ""},
    {title: "Bilirubin, Total (mg/dL)", value: ""},
    {title: "ALP (U/L)", value: ""},
    {title: "AST (U/L)", value: ""},
    {title: "ALT (U/L)", value: ""},
    {title: "Total Cholesterol (mg/dL)", value: ""},
    {title: "Triglycerides (mg/dL)", value: ""},
    {title: "HDL-C (mg/dL)", value: ""},
    {title: "LDL-C (mg/dL)", value: ""},
    {title: "TC/HDL (ratio)", value: ""},
    {title: "Pap Smear", value: ""},
    {title: "Mammogram", value: ""},
    {title: "DEXA Scan", value: ""},
]

Diabetesflowsheetslist=[
  {title:"Weight (lbs-oz)", value:""},  
  {title:"BMI (kg/m²)", value:""},
  {title:"Blood Pressure (mmHg)", value:""},
  {title:"HbA1c (%)", value:""},
  {title:"Glucose (mg/dL)", value:""},
  {title:"Total Cholesterol (mg/dL)", value:""},
  {title:"HDL-C (mg/dL)", value:""},
  {title:"LDL-C (mg/dL)", value:""},
  {title:"Triglycerides (mg/dL)", value:""},
  {title:"Triglycerides (mg/dL)", value:""},
  {title:"Creatinine (mg/dL)", value:""},
  {title:"BUN (mg/dL)", value:""}
]

Hypertentionflowsheetslist=[
  {title:"Weight (lbs-oz)", value:""},
  {title:"BMI (kg/m²)", value:""},
  {title:"Blood Pressure (mmHg)	", value:""},
  {title:"Glucose (mg/dL)	", value:""},
  {title:"Total Cholesterol (mg/dL)", value:""},
  {title:"HDL-C (mg/dL)", value:""},
  {title:"LDL-C (mg/dL)", value:""},
  {title:"Triglycerides (mg/dL)", value:""},
  {title:"TC/HDL (ratio)", value:""},
  {title:"Albumin/Creatinine (ratio)", value:""},
  {title:"eGFR (Non-African American) (mL/min/1.73)", value:""},
  {title:"eGFR (African American) (mL/min/1.73)", value:""},
]


vitalsflowsheetslist=[
  {title:"Height/Length (ft-in)", value:""},
  {title:"Weight (lbs-oz)", value:""},
  {title:"BMI (kg/m²)", value:""},
  {title:"Blood Pressure (mmHg)", value:""},
  {title:"Heart Rate (bpm)", value:""},
  {title:"Respiratory Rate (rpm)", value:""},
  {title:"Temperature (°F)", value:""},
  {title:"SpO² (%)", value:""},
  {title:"Inhaled O² (%)", value:""},
  {title:"Albumin/Creatinine (ratio)", value:""},
  {title:"Head Circ (in)", value:""}
]

}
