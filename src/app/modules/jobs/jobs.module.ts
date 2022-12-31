import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {JobsComponent} from "./jobs.component";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatTableModule} from "@angular/material/table";
import { CreateJobComponent } from './create-job/create-job.component';
import {ReactiveFormsModule} from "@angular/forms";
import {MatFormField, MatFormFieldModule} from "@angular/material/form-field";
import {MatDividerModule} from "@angular/material/divider";
import {GoogleMapsModule} from "@angular/google-maps";
import { MatInputModule } from '@angular/material/input';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import { JobDetailsComponent } from './job-details/job-details.component';
import {MatTooltipModule} from "@angular/material/tooltip";
import { EditJobComponent } from './job-details/edit-job/edit-job.component';

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
        path     : 'details',
        component: JobDetailsComponent,
    },
    {
        path     : 'details/update',
        component: EditJobComponent,
    },

];

@NgModule({
    declarations: [JobsComponent, CreateJobComponent, JobDetailsComponent,EditJobComponent],
    providers: [MatDatepickerModule],
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
        MatTooltipModule
    ]
})
export class JobsModule {
}
