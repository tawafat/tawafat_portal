import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DateTransformPipe } from './pipes/date-transform.pipe';
import { TimeAgoPipe } from './pipes/time-ago.pipe';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        DateTransformPipe,
        TimeAgoPipe,
    ],
    declarations: [
      DateTransformPipe,
      TimeAgoPipe,
    ]
})
export class SharedModule
{
}
