import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-demographic-upcoming-appointments',
  standalone: true,
  imports: [CommonModule,RouterModule,SharedModule],
  templateUrl: './demographic-upcoming-appointments.component.html',
  styleUrl: './demographic-upcoming-appointments.component.scss'
})
export class DemographicUpcomingAppointmentsComponent {
  routes = {
    profile: '/profile', // Replace with your actual route
  };
    info = [
      {
        date:"20 Oct 2022",
        time:"5.50 PM",
        image:"https://www.pngarts.com/files/10/Default-Profile-Picture-Download-PNG-Image.png",
        dp:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod",
        name:"Dr.Henry Markhay",
        det:"Completed the Patient visit at Glory Hospital in Florida, USA ."
      },
      {
        date:"21 Oct 2022",
        time:"10.50 PM",
        image:"https://www.pngarts.com/files/10/Default-Profile-Picture-Download-PNG-Image.png",
        dp:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod",
        name:"Rio Williams",
        det:"Posted a Blog about Corona Safety Measurements"
      },
      {
        date:"2 Oct 2020",
        time:"9.50 PM",
        image:"https://www.pngarts.com/files/10/Default-Profile-Picture-Download-PNG-Image.png",
        dp:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod",
        name:"Don Williams",
        det:"Posted a Blog about Corona Safety Measurements"
      }
    ]
}
