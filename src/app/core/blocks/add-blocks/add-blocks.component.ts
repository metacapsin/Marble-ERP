import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { routes } from 'src/app/shared/routes/routes';
import { SharedModule } from 'src/app/shared/shared.module';

import { AccordionModule } from 'primeng/accordion';
import { el } from '@fullcalendar/core/internal-common';

@Component({
  selector: 'app-add-blocks',
  standalone: true,
  imports: [CommonModule, SharedModule, ToastModule, AccordionModule],
  templateUrl: './add-blocks.component.html',
  styleUrl: './add-blocks.component.scss'
})
export class AddBlocksComponent {
  routes = routes
  addBlocksForm!: FormGroup;

  tabs = [
    { title: 'Block 1', content: 'Content 1' },
    { title: 'Block 2', content: 'Content 2' },
    // { title: 'Block 3', content: 'Content 3' },
    // { title: 'Block 4', content: 'Content 1' },
    // { title: 'Block 5', content: 'Content 2' },
    // { title: 'Block 6', content: 'Content 3' },
    // { title: 'Block 1', content: 'Content 1' },
    // { title: 'Block 2', content: 'Content 2' },
    // { title: 'Block 3', content: 'Content 3' },
    // { title: 'Block 4', content: 'Content 1' },
    // { title: 'Block 5', content: 'Content 2' },
    // { title: 'Block 6', content: 'Content 3' },
    // { title: 'Block 1', content: 'Content 1' },
    // { title: 'Block 2', content: 'Content 2' },
    // { title: 'Block 3', content: 'Content 3' },
    // { title: 'Block 4', content: 'Content 1' },
    // { title: 'Block 5', content: 'Content 2' },
    // { title: 'Block 6', content: 'Content 3' },
  ];


  constructor(private fb: FormBuilder) {
    this.addBlocksForm = this.fb.group({
      lotNumber: [''],
      blocksDetails: this.fb.array([]),
      otherCharges: [''],
      notes: [''],
      termAndCondition: [''],
      totalAmount: [''],

    })
  }

  addSalesControls() {
    const salesArray = this.addBlocksForm.get('blocksDetails') as FormArray;
    this.tabs?.forEach(sale => {
      salesArray.push(this.fb.group({
        height: ['', [Validators.required, Validators.min(0.01)]],
        width: ['', [Validators.required, Validators.min(0.01)]],
        length: ['', [Validators.required, Validators.min(0.01)]],
        blockNumber: ['', [Validators.required]],
        vaccume: ['', [Validators.min(1)]],
        pasting: ['', [Validators.min(1)]],
        dressing: ['', [Validators.min(1)]],
        sowingJob: ['', [Validators.min(1)]],
        plantManual: ['', [Validators.min(1)]],
        abroxy: ['', [Validators.min(1)]],
        transportation: ['', [Validators.min(1)]],
        peices: ['', [Validators.min(1)]],
        sqrt: ['', [Validators.min(1)]],
        rate: ['', [Validators.min(1)]],
        amount: ['']
      }));
    });
  }

  ngOnInit(): void {
    this.addSalesControls();
  }

  calculateTotalAmount() {
    let totalAmount = 0;
  
    const blocksArray = this.addBlocksForm.get('blocksDetails') as FormArray;
  
    blocksArray.controls.forEach((block: FormGroup) => {
      const vaccume = +block.get('vaccume').value || 0;
      const pasting  = +block.get('pasting').value || 0;
      const dressing = +block.get('dressing').value || 0;
      const sowingJob = +block.get('sowingJob').value || 0;
      const plantManual = +block.get('plantManual').value || 0;
      const abroxy  = +block.get('abroxy').value || 0;
      const transportation = +block.get('transportation').value || 0;
      // const sowingJob = +block.get('sowingJob').value || 0;
  
      const amount = vaccume + pasting + dressing + sowingJob + plantManual + abroxy + transportation;
      block.get('amount').setValue(amount.toFixed(2));
  
      totalAmount += amount;
    });
  
    // this.addBlocksForm.get('totalAmount').setValue(totalAmount.toFixed(2));
  }
  

  addBlocksFormSubmit() {
    const formData = this.addBlocksForm.value;

    const payload = {
      lotNumber: formData.lotNumber,
      blockDetails: formData.blockDetails,
      otherCharges: formData.otherCharges,
      notes: formData.notes,
      termAndCondition: formData.termAndCondition
    }

    if (this.addBlocksForm.valid) {
      console.log("block payload", payload);
      
      console.log("Block Form is Valid !", this.addBlocksForm.value);
    } else {
      console.log("Block Form is Invalid !");

    }

  }

}
