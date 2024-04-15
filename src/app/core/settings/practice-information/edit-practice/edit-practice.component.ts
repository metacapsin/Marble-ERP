import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService} from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { SettingsService } from 'src/app/shared/data/settings.service';
import { routes } from 'src/app/shared/routes/routes';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-edit-practice',
  templateUrl: './edit-practice.component.html',
  styleUrl: './edit-practice.component.scss',
  standalone: true,
  imports: [CommonModule,
    SharedModule,
    DropdownModule,
    ToastModule],
  providers: [MessageService]
})
export class EditPracticeComponent {
  public routes = routes;
  form!: FormGroup;
  states: any;
  practiceInformationData: any;
  ID: string = "";

  constructor(private fb: FormBuilder,
    private activeRoute: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private service: SettingsService,
    private router: Router,
    private messageService: MessageService
    ){
    this.form = this.fb.group({
      name: [' ', [Validators.required, Validators.pattern(new RegExp(/^.{5,50}$/))]],
      address: ['', [Validators.required, Validators.pattern(new RegExp(/^.{5,50}$/))]],
      address2: ['', [Validators.pattern(new RegExp(/^.{5,50}$/))]],
      city: ['', [Validators.required, Validators.pattern(new RegExp(/^.{5,50}$/))]],
      state: ['', Validators.required,],
      zip: ['', [Validators.required, Validators.pattern(new RegExp(/^\d{5}(?:-\d{4})?$/))]],
      country: [''],
      placeServiceCode: ['', []],
      phone: ['', [Validators.required, Validators.pattern(new RegExp(/^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/))]],
      fax: ['', [Validators.pattern(new RegExp(/^\+?(\d{1,3})?[-.\s]?\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})$/))]],
      locationContact: ['', [Validators.pattern(new RegExp(/^.{0,100}$/))]],
      ein: ['', [Validators.pattern(new RegExp(/^[0-9]{9}$/))]],
      groupNpi: ['', [Validators.pattern(new RegExp(/^[0-9]{10}$/))]],
      seeFinancialDetails: ['', []],
      selfPay: ['', []],
      sendBirthdayMsg: ['', []],
      practiceLogo: ['', []],
      id: ['']
    });
  }

  ngOnInit(): void {

    this.activeRoute.params.subscribe(params => {
      this.ID = params['id'];
    });

    this.service.getStateList().subscribe((resp: any) => {
      this.states = resp.data;
    })

    this.service.getPracticeInformationById(this.ID).subscribe((resp: any) => {
      this.practiceInformationData = resp.data;
      this.form.patchValue({
        name: this.practiceInformationData.name,
        address: this.practiceInformationData.address,
        address2: this.practiceInformationData.address2,
        city: this.practiceInformationData.city,
        state: this.practiceInformationData.state,
        zip: this.practiceInformationData.zip,
        country: this.practiceInformationData.country,
        placeServiceCode: this.practiceInformationData.placeServiceCode,
        phone: this.practiceInformationData.phone,
        fax: this.practiceInformationData.fax,
        locationContact: this.practiceInformationData.locationContact,
        ein: this.practiceInformationData.ein,
        groupNpi: this.practiceInformationData.groupNpi,
        seeFinancialDetails: this.practiceInformationData.seeFinancialDetails,
        selfPay: this.practiceInformationData.selfPay,
        sendBirthdayMsg: this.practiceInformationData.sendBirthdayMsg,
        practiceLogo: this.practiceInformationData.practiceLogo,
      })
    })
  }
  PracticeFormSubmit() {
    if (this.form.valid) {
      console.log(this.form.value);
      this.form.value.id = this.ID;
      this.service.updatePracticeInformationById(this.form.value, this.ID).subscribe((resp: any) => {
        if (resp.status === 'success') {
          const message = "Practice Information has been updated";
          this.messageService.add({ severity: 'success', detail: message });
          setTimeout(() => {
            this.router.navigate(['/settings/practice-information']);
          }, 400);
        } else {
          const message = resp.message
          this.messageService.add({ severity: 'error', detail: message });
        }
      })
    } else {
      console.log("Form is invalid!");
    }
  }

}
