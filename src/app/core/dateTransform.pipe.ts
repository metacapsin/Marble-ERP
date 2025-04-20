import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'dateTransform',
  standalone: true
})
export class DateTransformPipe implements PipeTransform {

  transform(value: string): Date | null {
    if (!value) return null;

    // Use moment to parse "dd/mm/yyyy" correctly
    let formattedDate = moment(value, "DD/MM/YYYY", true);

    // Check if parsing is valid
    return formattedDate.isValid() ? formattedDate.toDate() : null;
  }
  

}
