import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { validationRegex } from 'src/app/core/validation';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';

interface BankAccount {
  _id?: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  branchName: string;
  accountHolderName: string;
}

@Component({
  selector: 'app-bank-account-dialog',
  templateUrl: './bank-account-dialog.component.html',
  styleUrls: ['./bank-account-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    MatDialogModule
  ]
})
export class BankAccountDialogComponent implements OnInit {
  bankAccountForm: FormGroup;
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<BankAccountDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { bankAccount: BankAccount | null }
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    console.log('Dialog data:', this.data); // Debug log
    if (this.data?.bankAccount) {
      this.isEditMode = true;
      const bankAccount = this.data.bankAccount;
      console.log('Setting form values:', bankAccount); // Debug log
      
      this.bankAccountForm.patchValue({
        bankName: bankAccount.bankName,
        accountNumber: bankAccount.accountNumber,
        ifscCode: bankAccount.ifscCode,
        branchName: bankAccount.branchName,
        accountHolderName: bankAccount.accountHolderName
      });
    }
  }

  initForm() {
    this.bankAccountForm = this.fb.group({
      bankName: ['', [Validators.required, Validators.pattern(validationRegex.bankName)]],
      accountNumber: ['', [Validators.required, Validators.pattern(validationRegex.accountNumber)]],
      ifscCode: ['', [Validators.required, Validators.pattern(validationRegex.ifscCode)]],
      branchName: ['', [Validators.required, Validators.pattern(validationRegex.branchName)]],
      accountHolderName: ['', [Validators.required, Validators.pattern(validationRegex.accountHolderName)]]
    });
  }

  onSubmit() {
    if (this.bankAccountForm.valid) {
      console.log('Form submitted:', this.bankAccountForm.value); // Debug log
      this.dialogRef.close(this.bankAccountForm.value);
    } else {
      console.log('Form is invalid!');
    }
  }

  onCancel() {
    this.dialogRef.close(true);
  }
} 