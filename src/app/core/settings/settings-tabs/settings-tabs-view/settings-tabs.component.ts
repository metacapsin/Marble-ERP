import { Component } from '@angular/core';
import { routes } from 'src/app/shared/routes/routes';
interface ITabInfo{
  label:string;
  route?: string,
}
@Component({
  selector: 'app-settings-tabs',
  templateUrl: './settings-tabs.component.html',
  styleUrls: ['./settings-tabs.component.scss']
})
export class SettingsTabsComponent {
  public routes = routes;
  
  tabInfo:ITabInfo[]=[
    {
    label: 'General Settings',
    route:routes.settings
   },
    {
    label: 'Practice Information',
    route:routes.practiceInformation
   },
    {
    label: 'Providers Profiles',
    route:routes.providersList
   },
    {
    label: 'Service Location',
    route:routes.serviceLocations
   },
    {
    label: 'Calendar Settings',
    route:routes.calendarSettings
   },
  ]
}
