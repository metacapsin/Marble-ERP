import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { GeneralPartiesService, GeneralEntry } from '../general-parties.service';
import { routes } from 'src/app/shared/routes/routes';

@Component({
  selector: 'app-add-general-parties',
  templateUrl: './add-general-parties.component.html',
  styleUrls: ['./add-general-parties.component.scss']
})
export class AddGeneralPartiesComponent implements OnInit {
  addGeneralPartyGroup: FormGroup;
  public routes = routes;
  public layout: string = 'horizontal';
  public showPassword: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private generalPartiesService: GeneralPartiesService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.addGeneralPartyGroup = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.email]],
      phoneNo: [''],
      taxNo: [''],
      billingAddress: [''],
      penCardNumber: [''],
      openingBalance: [0],
      balanceType: ['']
    });
  }

  ngOnInit(): void {}

  addGeneralPartyForm() {
    if (this.addGeneralPartyGroup.valid) {
      const formData: GeneralEntry = this.addGeneralPartyGroup.value;
      
      this.generalPartiesService.AddGeneralPartyApi(formData).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'General party added successfully'
          });
          this.router.navigate(['/general-parties']);
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error adding general party'
          });
          console.error('Error:', error);
        }
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill in all required fields'
      });
    }
  }
} 