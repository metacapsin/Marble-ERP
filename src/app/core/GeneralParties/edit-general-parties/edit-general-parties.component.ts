import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { GeneralPartiesService, GeneralEntry } from '../general-parties.service';
import { routes } from 'src/app/shared/routes/routes';

@Component({
  selector: 'app-edit-general-parties',
  templateUrl: './edit-general-parties.component.html',
  styleUrls: ['./edit-general-parties.component.scss']
})
export class EditGeneralPartiesComponent implements OnInit {
  editGeneralPartyGroup: FormGroup;
  public routes = routes;
  public layout: string = 'horizontal';
  public showPassword: boolean = false;
  private id: string;

  constructor(
    private formBuilder: FormBuilder,
    private generalPartiesService: GeneralPartiesService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {
    this.editGeneralPartyGroup = this.formBuilder.group({
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

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.loadGeneralPartyData();
  }

  loadGeneralPartyData() {
    this.generalPartiesService.GetGeneralPartyDataById(this.id).subscribe({
      next: (response) => {
        this.editGeneralPartyGroup.patchValue({
          name: response.name,
          email: response.email,
          phoneNo: response.phoneNo,
          taxNo: response.taxNo,
          billingAddress: response.billingAddress,
          penCardNumber: response.penCardNumber,
          openingBalance: response.openingBalance || 0,
          balanceType: response.balanceType || ''
        });
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error loading general party data'
        });
        console.error('Error:', error);
      }
    });
  }

  editGeneralPartyForm() {
    if (this.editGeneralPartyGroup.valid) {
      const formData: GeneralEntry = this.editGeneralPartyGroup.value;
      
      this.generalPartiesService.UpdateGeneralPartyApi(this.id, formData).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'General party updated successfully'
          });
          this.router.navigate(['/general-parties']);
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error updating general party'
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