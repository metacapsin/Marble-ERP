import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { BillingAddressService } from "../billingAddress.service";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MessageService } from "primeng/api";
import { routes } from "src/app/shared/routes/routes";
import { WarehouseService } from "../../warehouse/warehouse.service";
import { SharedModule } from "src/app/shared/shared.module";
import { validationRegex } from "src/app/core/validation";
import { BankAccountsService } from "../../bank-accounts/bank-accounts.service";

interface BankAccount {
  _id: string;
  bankName: string;
  accountNumber: string;
}

@Component({
  selector: "app-edit-billing-Address",
  templateUrl: "./edit-billing-Address.component.html",
  styleUrls: ["./edit-billing-Address.component.scss"],
  standalone: true,
  imports: [SharedModule],
  providers: [MessageService],
})
export class EditBillingAddressComponent implements OnInit {
  public routes = routes;
  id = "";
  EditUserData: any;
  editBillingAddress: UntypedFormGroup;
  data: any = null;
  wareHousedata: any = [];
  wareHouseLists = [];
  orgCountriesList: any;
  countriesList: any[];
  billingAddressData: any;
  bankAccounts: BankAccount[] = [];

  nameRegex = /^(?=[^\s])([a-zA-Z\d\/\- ]{3,50})$/;
  emailRegex: string = "^(?!.*\\s)[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
  addressRegex = /^.{3,500}$/s;
  phoneRegex = /^[0-9]{10}$/;
  taxNumberRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z0-9]{15}$/;
  StatesList: any;

  constructor(
    private activeRoute: ActivatedRoute,
    private UserEditData: BillingAddressService,
    private router: Router,
    private fb: UntypedFormBuilder,
    private messageService: MessageService,
    private bankAccountsService: BankAccountsService
  ) {
    this.id = this.activeRoute.snapshot.params["id"];
    this.editBillingAddress = this.fb.group({
      city: ['', [Validators.required,Validators.pattern(validationRegex.cityNameRGEX)]],
      setAsDefault: [''],
      companyName:['',[Validators.required, Validators.pattern(validationRegex.companyNameRGEX)]],
      postalCode:['',[Validators.required,Validators.pattern(validationRegex.postalZipRGEX)]],
      country: ['',[Validators.required]],
      phoneNumber: ['',[Validators.required,Validators.pattern(validationRegex.phoneRGEX)]],
      email:['',[Validators.pattern(validationRegex.emailRegex)]],
      addressLine1:['',[Validators.required,Validators.pattern(validationRegex.billingAddressRegex)]],
      addressLine2:['',[Validators.pattern(validationRegex.billingAddressRegex)]],
      state:['',[Validators.required]],
      taxNo: [''],
      termsAndCondition:[''],
      subjectTo: [""],
      associatedBankAccount: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.getBankAccounts();
    this.UserEditData.getBillingAddressById(this.id).subscribe((resp: any) => {
      this.billingAddressData = resp.data;
      this.patchForm(this.billingAddressData);
    });
    this.getStates();
    this.UserEditData.getCountries().subscribe((resp: any) => {
      this.countriesList = [];
      this.orgCountriesList = resp.data;
      this.orgCountriesList.forEach((element) => {
        this.countriesList.push({
          name: element.name,
          iso2: element.iso2,
        });
      });
      console.log(this.countriesList);
    });
  }

  getBankAccounts(): void {
    this.bankAccountsService.getBankAccountsList().subscribe({
      next: (response: any) => {
        if (response.status === 'success') {
          // Map the response to include only required fields
          this.bankAccounts = response.data.map((account: any) => ({
            _id: account._id,
            bankName: account.bankName,
            accountNumber: account.accountNumber
          }));
          console.log('Bank Accounts:', this.bankAccounts);
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

  getBankAccountLabel(bankAccount: BankAccount): string {
    return `${bankAccount.bankName} (${bankAccount.accountNumber.slice(-4)})`;
  }

  patchForm(data) {
    console.log('Patching form with data:', data);
    this.editBillingAddress.patchValue(data);
  }

  editBillingAddressForm() {
    const payload = {
      ...this.editBillingAddress.value,
      id: this.id,
    };
    if (this.editBillingAddress.value) {
      this.UserEditData.updateBillingAddress(payload).subscribe(
        (resp: any) => {
          if (resp) {
            if (resp.status === "success") {
              this.messageService.add({
                severity: "success",
                detail: resp?.message,
              });
              setTimeout(() => {
                this.router.navigate(["/settings/billing-Address"]);
              }, 400);
            } else {
              this.messageService.add({ severity: "error", detail: resp?.message });
            }
          }
        }
      );
    } else {
      console.log("Form is invalid!");
    }
  }

  getStates() {
    this.UserEditData.getstates().subscribe((resp: any) => {
      this.StatesList = resp.data;
    });
  }
}
