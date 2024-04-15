import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-calendar-settings-edit-hours-dialog',
  templateUrl: './calendar-settings-edit-hours-dialog.component.html',
  styleUrls: ['./calendar-settings-edit-hours-dialog.component.scss']
})
export class CalendarSettingsEditHoursDialogComponent {
  constructor (public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<CalendarSettingsEditHoursDialogComponent>){
      
    }
}
