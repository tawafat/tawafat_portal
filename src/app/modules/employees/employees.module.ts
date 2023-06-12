import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EmployeesComponent} from "./employees.component";
import {RouterModule, Routes} from "@angular/router";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatDividerModule} from "@angular/material/divider";
import {MatSidenavModule} from "@angular/material/sidenav";
import {ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatTableModule} from "@angular/material/table";
import {SharedModule} from "../../shared/shared.module";


const routes: Routes = [
    {
        path: '',
        component: EmployeesComponent,
    }
];

@NgModule({
    declarations: [EmployeesComponent],
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
        MatIconModule,
        MatButtonModule,
        MatDividerModule,
        MatSidenavModule,
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatTableModule,
        SharedModule,
    ]
})
export class EmployeesModule {
}
