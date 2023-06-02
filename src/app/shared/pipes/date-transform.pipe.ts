import { Pipe, PipeTransform } from '@angular/core';
import moment from "moment/moment";

@Pipe({
  name: 'dateTransform'
})
export class DateTransformPipe implements PipeTransform {

  transform(value: any, inputFormat: string= 'YYYY-MM-DD hh:mm:ss', dateOnly: boolean = false): string {
      const formattedDate = this.defaultDateFormat(value, inputFormat);

      if (formattedDate !== 'Invalid date') {
          const date = formattedDate.split(' ')[0];
          const time = formattedDate.split(' ')[1];
          let ampm = formattedDate.split(' ')[2];
          ampm = ampm === 'am' ? 'ص' : 'م'
          if (!dateOnly) {
              return date + ' ' + time + ' ' + ampm;
          } else {
              return date;
          }
          return null;
      }
  }

  private defaultDateFormat(dateObj: any, inputFormat: string = 'YYYY-MM-DD hh:mm:ss', outputFormat: string = 'YYYY-MM-DD hh:mm a'): string{
      return moment(dateObj,inputFormat).format(outputFormat);
  }

}
