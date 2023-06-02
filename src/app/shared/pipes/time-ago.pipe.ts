import {Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment';

@Pipe({
    name: 'timeAgo'
})
export class TimeAgoPipe implements PipeTransform {

    transform(value: any, inputFormat: string = 'YYYY-MM-DD hh:mm:ss'): string {
        return this.dateFromNow(value, inputFormat);
    }

    dateFromNow(dateObj: any, inputFormat: string = 'YYYY-MM-DD hh:mm:ss', outputFormat: string = 'YYYY-MM-DD hh:mm a'): string {
        moment.locale('ar');
        if (inputFormat === 'unix') {
            return moment(dateObj).fromNow();
        } else {
            return moment(dateObj, inputFormat).fromNow();
        }
    }

}
