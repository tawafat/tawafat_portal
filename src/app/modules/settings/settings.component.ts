import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";

export interface PeriodicElement {
    number: string,
    name: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
    {
        number: '',
        name: 'تنظيف أنابيب الهواء',
    },
    {
        number: '',
        name: 'تنظيف أنابيب الهواء',
    },

];

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit{
    showFiller: boolean = false;
    createCategoryForm: FormGroup;
    dataSource: MatTableDataSource<any>;
    @ViewChild('paginator') paginator: MatPaginator;
    displayedColumns: string[] = ['number','name'];

    constructor(private _formBuilder: FormBuilder) {
    }
    ngOnInit(): void {
        this.createCategoryForm = this._formBuilder.group({
            name: ['',Validators.required],
        });
        this.dataSource = new MatTableDataSource(ELEMENT_DATA);

    }


    addCategory() {
        this.showFiller = !this.showFiller;
        console.log('showFiller', this.showFiller);
    }
}
