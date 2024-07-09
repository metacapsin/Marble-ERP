import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { SharedModule } from "src/app/shared/shared.module";
import { SettingsService } from "src/app/shared/data/settings.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { routes } from "src/app/shared/routes/routes";
import { ToastModule } from "primeng/toast";
import { DropdownModule } from "primeng/dropdown";
import { MessageService } from "primeng/api";

@Component({
  selector: "app-add-practice",
  templateUrl: "./add-practice.component.html",
  styleUrl: "./add-practice.component.scss",
  standalone: true,
  imports: [SharedModule],
  providers: [MessageService],
})
export class AddPracticeComponent {
  public routes = routes;
  form!: FormGroup;
  states: any = [];

  constructor(
    private service: SettingsService,
    private _snackBar: MatSnackBar,
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService
  ) {
    this.form = this.fb.group({
      name: [
        "",
        [Validators.required, Validators.pattern(new RegExp(/^.{5,50}$/))],
      ],
      address: [
        "",
        [Validators.required, Validators.pattern(new RegExp(/^.{5,50}$/))],
      ],
      address2: ["", [Validators.pattern(new RegExp(/^.{5,50}$/))]],
      city: [
        "",
        [Validators.required, Validators.pattern(new RegExp(/^.{5,50}$/))],
      ],
      state: ["", Validators.required],
      zip: [
        "",
        [
          Validators.required,
          Validators.pattern(new RegExp(/^\d{5}(?:-\d{4})?$/)),
        ],
      ],
      country: [""],
      placeServiceCode: ["", []],
      phone: [
        "",
        [
          Validators.required,
          Validators.pattern(
            new RegExp(/^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/)
          ),
        ],
      ],
      fax: [
        "",
        [
          Validators.pattern(
            new RegExp(
              /^\+?(\d{1,3})?[-.\s]?\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})$/
            )
          ),
        ],
      ],
      locationContact: ["", [Validators.pattern(new RegExp(/^.{0,100}$/))]],
      ein: ["", [Validators.pattern(new RegExp(/^[0-9]{9}$/))]],
      groupNpi: ["", [Validators.pattern(new RegExp(/^[0-9]{10}$/))]],
      seeFinancialDetails: ["", []],
      selfPay: ["", []],
      sendBirthdayMsg: ["", []],
      practiceLogo: ["", []],
    });
  }

  ngOnInit(): void {
    this.service.getStateList().subscribe((resp: any) => {
      this.states = resp.data;
    });
  }

  PracticeFormSubmit() {
    if (this.form.valid) {
      console.log(this.form.value);
      this.service
        .CreatePracticeInformation(this.form.value)
        .subscribe((resp: any) => {
          if (resp.status === "success") {
            const message = "Practice Information has been added";
            this.messageService.add({ severity: "success", detail: message });
            setTimeout(() => {
              this.router.navigate(["/settings/practice-information"]);
            }, 400);
          } else {
            const message = resp.message;
            this.messageService.add({ severity: "error", detail: message });
          }
        });
    } else {
      console.log("Form is invalid!");
    }
  }
}
