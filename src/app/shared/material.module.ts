import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatDialogModule } from "@angular/material/dialog";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatIconModule } from "@angular/material/icon";



@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        MatDatepickerModule,
        MatCardModule,
        MatNativeDateModule,
        MatSelectModule,
        MatFormFieldModule,
        MatProgressBarModule,
        MatSnackBarModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        MatIconModule

    ],
    exports: [
        CommonModule,
        MatDatepickerModule,
        MatCardModule,
        MatNativeDateModule,
        MatSelectModule,
        MatFormFieldModule,
        MatProgressBarModule,
        MatSnackBarModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        MatIconModule
    ]
})

export class materialModule { }