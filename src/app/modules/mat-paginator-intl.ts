import {Injectable} from '@angular/core';
import {MatPaginatorIntl} from '@angular/material/paginator';
import {TranslocoService} from '@ngneat/transloco';

@Injectable()
export class MatPaginatorIntlCro extends MatPaginatorIntl {
  constructor(private translocoService: TranslocoService) {
    super();
  }

  itemsPerPageLabel = this.translocoService.translate('Items per page:');
  nextPageLabel = this.translocoService.translate('Next Page');
  previousPageLabel = this.translocoService.translate('Previous Page');

  getRangeLabel = (page, pageSize, length) => {
    if (length === 0 || pageSize === 0) {
      return '0 ' + this.translocoService.translate('of') + length;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;
    return startIndex + 1 + ' - ' + endIndex + ' ' + this.translocoService.translate('of') + ' ' + length;
  };

}
