import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {JobsComponent} from "./jobs.component";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatTableModule} from "@angular/material/table";
import { CreateJobComponent } from './create-job/create-job.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatFormField, MatFormFieldModule} from "@angular/material/form-field";
import {MatDividerModule} from "@angular/material/divider";
import {GoogleMap, GoogleMapsModule} from "@angular/google-maps";
import { MatInputModule } from '@angular/material/input';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import { JobDetailsComponent } from './job-details/job-details.component';
import {MatTooltipModule} from "@angular/material/tooltip";
import { EditJobComponent } from './job-details/edit-job/edit-job.component';
import {
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule
} from "@angular-material-components/datetime-picker";
import {NgxMatMomentModule} from "@angular-material-components/moment-adapter";
import {SharedModule} from "../../shared/shared.module";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";

const routes: Routes = [
    {
        path     : '',
        component: JobsComponent,
    },
    {
        path     : 'create',
        component: CreateJobComponent,
    },
    {
        path     : 'details/:jobId' ,
        component: JobDetailsComponent,
    },
    {
        path     : 'details/update/:jobId',
        component: EditJobComponent,
    },

];

@NgModule({
    declarations: [JobsComponent, CreateJobComponent, JobDetailsComponent,EditJobComponent],
    providers: [MatDatepickerModule, GoogleMap],
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
        MatIconModule,
        MatButtonModule,
        MatPaginatorModule,
        MatTableModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatDividerModule,
        MatInputModule,
        GoogleMapsModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatTooltipModule,
        MatDatepickerModule,
        MatInputModule,
        NgxMatTimepickerModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        NgxMatDatetimePickerModule,
        NgxMatMomentModule,
        SharedModule,
    ]
})
export class JobsModule {
}
