import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { BankAccountsService } from './bank-accounts.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { validationRegex } from 'src/app/core/validation';
import { BankAccountDialogComponent } from './bank-account-dialog/bank-account-dialog.component';
import { FilterPipe } from 'src/app/core/filter.pipe';
import { ConfirmDialogComponent } from 'src/app/common-component/modals/confirm-dialog/confirm-dialog.component';

interface BankAccount {
  _id: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  branchName: string;
  accountHolderName: string;
}

interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

@Component({
  selector: 'app-bank-accounts',
  templateUrl: 'bank-accounts.component.html',
  styleUrls: ['./bank-accounts.component.scss'],
  providers: [MessageService, ConfirmationService, FilterPipe]
})
export class BankAccountsComponent implements OnInit {
  bankAccountsList: BankAccount[] = [];
  searchDataValue: string = '';
  isSubmitting = false;
  showDialog = false;
  modalData: any = {};
  bankAccountId: string;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private bankAccountsService: BankAccountsService,
    private dialog: MatDialog,
    private filterPipe: FilterPipe
  ) {}

  ngOnInit(): void {
    this.getBankAccountsList();
  }

  getBankAccountsList(): void {
    this.bankAccountsService.getBankAccountsList().subscribe({
      next: (response: ApiResponse<BankAccount[]>) => {
        if (response.status === 'success') {
          this.bankAccountsList = response.data;
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response.message || 'Failed to fetch bank accounts'
          });
        }
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message || 'Failed to fetch bank accounts'
        });
      }
    });
  }

  showAddModal(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '600px';
    dialogConfig.data = { bankAccount: null };

    const dialogRef = this.dialog.open(BankAccountDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) return;
      if (result) {
        this.addBankAccount(result);
      }
    });
  }

  showEditModal(bankAccount: BankAccount): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '600px';
    dialogConfig.data = { 
      bankAccount: {
        _id: bankAccount._id,
        bankName: bankAccount.bankName,
        accountNumber: bankAccount.accountNumber,
        ifscCode: bankAccount.ifscCode,
        branchName: bankAccount.branchName,
        accountHolderName: bankAccount.accountHolderName
      }
    };

    const dialogRef = this.dialog.open(BankAccountDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) return;
      if (result) {
        this.updateBankAccount(bankAccount._id, result);
      }
    });
  }

  addBankAccount(formData: any): void {
    this.isSubmitting = true;
    this.bankAccountsService.addBankAccount(formData).subscribe({
      next: (response: ApiResponse<BankAccount>) => {
        if (response.status === 'success') {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Bank account added successfully'
          });
          this.getBankAccountsList();
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response.message || 'Failed to add bank account'
          });
        }
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message || 'Failed to add bank account'
        });
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }

  updateBankAccount(id: string, formData: any): void {
    this.isSubmitting = true;
    this.bankAccountsService.updateBankAccount(id, formData).subscribe({
      next: (response: ApiResponse<BankAccount>) => {
        if (response.status === 'success') {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Bank account updated successfully'
          });
          this.getBankAccountsList();
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response.message || 'Failed to update bank account'
          });
        }
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message || 'Failed to update bank account'
        });
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }

  confirmDelete(bankAccount: BankAccount): void {
    this.bankAccountId = bankAccount._id;
    this.modalData = {
      title: 'Delete',
      messege: 'Are you sure you want to delete this Bank Account'
    };
    this.showDialog = true;
  }

  callBackModal() {
    this.bankAccountsService.deleteBankAccount(this.bankAccountId).subscribe({
      next: (response: ApiResponse<null>) => {
        if (response.status === 'success') {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Bank account deleted successfully'
          });
          this.getBankAccountsList();
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response.message || 'Failed to delete bank account'
          });
        }
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message || 'Failed to delete bank account'
        });
      },
      complete: () => {
        this.showDialog = false;
      }
    });
  }

  close() {
    this.showDialog = false;
  }

  onPageChange(event: any): void {
    // Handle pagination if needed
  }
} 