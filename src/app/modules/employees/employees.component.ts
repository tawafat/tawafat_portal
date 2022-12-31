import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";


@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})

export class EmployeesComponent{
    showFiller = false;
    createUserForm: FormGroup;

    constructor(private _formBuilder: FormBuilder) {
    }

    ngOnInit(): void {
        this.createUserForm = this._formBuilder.group({
            name: ['',Validators.required],
            email: ['',Validators.required],
            password: ['',Validators.required],
        });
    }

}
