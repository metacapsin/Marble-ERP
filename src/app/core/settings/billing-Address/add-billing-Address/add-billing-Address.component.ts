import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { Validators } from "@angular/forms";
import { SharedModule } from "src/app/shared/shared.module";
import { BillingAddressService } from "../billingAddress.service";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { routes } from "src/app/shared/routes/routes";
import { MessageService } from "primeng/api";
import { WarehouseService } from "../../warehouse/warehouse.service";
import { validationRegex } from "src/app/core/validation";
import { BankAccountsService } from "../../bank-accounts/bank-accounts.service";

interface BankAccount {
  _id: string;
  bankName: string;
  accountNumber: string;
}

@Component({
  selector: "app-add-billing-Address",
  standalone: true,
  templateUrl: "./add-billing-Address.component.html",
  styleUrls: ["./add-billing-Address.component.scss"],
  imports: [SharedModule],
  providers: [MessageService],
})
export class AddBillingAddressComponent implements OnInit {
  public routes = routes;
  addBillingAddress: UntypedFormGroup;
  public passwordClass = false;
  wareHousedata: any = [];
  wareHouseLists = [];
  bankAccounts: BankAccount[] = [];

  // Regex pattern

  nameRegex = /^(?=[^\s])([a-zA-Z\d\/\- ]{3,50})$/;

  emailRegex: string =
    "^(?!.*\\s)[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";

  addressRegex = /^.{3,500}$/s;

  phoneRegex = /^[0-9]{10}$/;
  passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
  countriesList: any;
  orgCountriesList: any;

  ZIPcode = /^\d{5}(-\d{4})?$/;
  cityName = /^[a-zA-Z\s\-]{2,50}$/;
  taxNumberRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z0-9]{15}$/;
  StatesList: any;

  constructor(
    private fb: UntypedFormBuilder,
    private Addusersdata: BillingAddressService,
    private router: Router,
    private messageService: MessageService,
    private bankAccountsService: BankAccountsService
  ) {
    this.addBillingAddress = this.fb.group({
      city: [
        "",
        [Validators.required, Validators.pattern(validationRegex.cityNameRGEX)],
      ],
      setAsDefault: [""],
      companyName: [
        "",
        [
          Validators.required,
          Validators.pattern(validationRegex.companyNameRGEX),
        ],
      ],
      postalCode: [
        "",
        [
          Validators.required,
          Validators.pattern(validationRegex.postalZipRGEX),
        ],
      ],
      country: ["", [Validators.required]],
      phoneNumber: [
        "",
        [Validators.required, Validators.pattern(validationRegex.phoneRGEX)],
      ],
      email: ["", [Validators.pattern(validationRegex.emailRegex)]],
      addressLine1: [
        "",
        [
          Validators.required,
          Validators.pattern(validationRegex.billingAddressRegex),
        ],
      ],
      addressLine2: [
        "",
        [Validators.pattern(validationRegex.billingAddressRegex)],
      ],
      state: [
        "",
        [Validators.required],
      ],
      taxNo: [""],
      termsAndCondition: [""],
      subjectTo: [""],
      associatedBankAccount: ['', [Validators.required]]
    });
  }
  ngOnInit(): void {
    this.getStates()
    this.getBankAccounts()
    this.Addusersdata.getCountries().subscribe((resp: any) => {
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

  addBillingAddressFrom() {
    const formData = this.addBillingAddress.value;


    this.Addusersdata.createBillingAddress(formData).subscribe((resp: any) => {
      console.log(resp);
      if (resp) {
        if (resp.status === "success") {
          const message = "Billing Address has been added";
          this.messageService.add({ severity: "success", detail: message });
          setTimeout(() => {
            this.router.navigate(["/settings/billing-Address"]);
          }, 400);
        } else {
          const message = resp.message;
          this.messageService.add({ severity: "error", detail: message });
        }
      }
    });
  }

  togglePassword() {
    this.passwordClass = !this.passwordClass;
  }

  getStates() {
    this.Addusersdata.getstates().subscribe((resp: any) => {
      this.StatesList = resp.data;
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
          console.log('Bank Accounts:', this.bankAccounts); // For debugging
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
}
