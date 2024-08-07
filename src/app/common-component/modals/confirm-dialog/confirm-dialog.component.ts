import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SharedModule } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';


@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss',
  standalone:true,
  imports: [CommonModule, SharedModule, DialogModule],
})
export class ConfirmDialogComponent {
  @Input() showDialog: boolean = false;
  @Input() data: any;
  @Output() callbackModal = new EventEmitter<any>();
  @Output() close = new EventEmitter<any>();

  constructor() { }
 
  ngOnInit() {
  }
  
  closeTheWindow(){
     this.close.emit();
  }

  okay(){
    this.callbackModal.emit();
  }
}
