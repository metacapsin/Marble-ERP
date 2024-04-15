import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedModule } from 'src/app/shared/shared.module';
import { CheckboxModule } from 'primeng/checkbox';
import { SettingsService } from 'src/app/shared/data/settings.service';
import { routes } from 'src/app/shared/routes/routes';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-receipt-settings',
  templateUrl: './receipt-settings.component.html',
  styleUrls: ['./receipt-settings.component.scss'],
  standalone: true,
  imports: [CommonModule,
    SharedModule,
    CheckboxModule,
    ToastModule],
    providers: [MessageService]
})
export class ReceiptSettingsComponent {
  public routes = routes;
  ReceiptForm!: FormGroup;
  EnableisChecked: boolean = false;


  constructor(private fb: FormBuilder, private _snackBar: MatSnackBar, private service: SettingsService, private messageService: MessageService) {
    this.ReceiptForm = this.fb.group({
      receiptSettingsEnable: [''],
      receiptSettingsIncludeNotes: [''],
      receiptSettingsIncludeNpi: [''],
      receiptSettingsIncludeTax: [''],
    });

  }
  
  ngOnInit(): void {
    this.getReceiptSettingsData();
  }

  getReceiptSettingsData() {
    this.service.getReceiptSettings().subscribe((resp: any) => {


      this.ReceiptForm.patchValue({
        receiptSettingsEnable: resp.data[0].receiptSettingsEnable,
        receiptSettingsIncludeNotes: resp.data[0].receiptSettingsIncludeNotes,
        receiptSettingsIncludeNpi: resp.data[0].receiptSettingsIncludeNpi,
        receiptSettingsIncludeTax: resp.data[0].receiptSettingsIncludeTax,
      })
    })
  }

  ReceiptFormSubmit() {
    if (this.ReceiptForm.valid) {

      this.service.updateReceiptSettings(this.ReceiptForm.value).subscribe((resp: any) => {
        if(resp.status === 'success'){
          console.log("Success", resp)
          const message = "Receipt Settings has been updated"
          this.messageService.add({ severity: 'success', summary: '', detail: message });
          this.getReceiptSettingsData();
        }else{
          const message = resp.message
          this.messageService.add({ severity: 'error', summary: '', detail: message });
        }
      })

      console.log("Form is valid!");
    } else {
      console.log("Form is invalid!");
    }
  }

  ReceiptFormCancle() {

  }
}
