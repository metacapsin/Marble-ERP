import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-demographic-past-appointments',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './demographic-past-appointments.component.html',
  styleUrl: './demographic-past-appointments.component.scss'
})
export class DemographicPastAppointmentsComponent {
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
