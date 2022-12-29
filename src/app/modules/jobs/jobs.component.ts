import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from "@angular/material/table";
import {Router} from "@angular/router";

export interface PeriodicElement {
    status: string;
    name: string;
    category: string;
    startDate: string;
    startTime: string;
    endDate: string;
    assignedBy: string;
    complain: boolean;
}


const ELEMENT_DATA: PeriodicElement[] = [
    {
        status: 'completed',
        name: 'تنظيف أنابيب الهواء',
        category: 'تنظيف',
        startDate: '25/12/2022 ',
        startTime: '3:10 ص',
        endDate: '25/12/2022',
        assignedBy: 'ذكرية عبد الله',
        complain: true
    },
    {
        status: 'inactive',
        name: 'تنظيف أنابيب الهواء',
        category: 'تنظيف',
        startDate: '25/12/2022 ',
        startTime: '3:10 ص',
        endDate: '25/12/2022',
        assignedBy: 'ذكرية عبد الله',
        complain: true,

    },
    {
        status: 'missed',
        name: 'تنظيف أنابيب الهواء',
        category: 'تنظيف',
        startDate: '25/12/2022 ',
        startTime: '3:10 ص',
        endDate: '25/12/2022',
        assignedBy: 'ذكرية عبد الله',
        complain: false,
    },
    {
        status: 'late',
        name: 'تنظيف أنابيب الهواء',
        category: 'تنظيف',
        startDate: '25/12/2022 ',
        startTime: '3:10 ص',
        endDate: '25/12/2022',
        assignedBy: 'ذكرية عبد الله',
        complain: true,

    },


];


@Component({
    selector: 'app-jobs',
    templateUrl: './jobs.component.html',
    styleUrls: ['./jobs.component.scss']
})

export class JobsComponent implements OnInit {
    @ViewChild('paginator') paginator: MatPaginator;
    dataSource: MatTableDataSource<any>;
    displayedColumns: string[] = ['status', 'name', 'category', 'startDate', 'startTime', 'endDate', 'assignedBy', 'complain'];

    constructor(private _router: Router) {
    }

    ngOnInit(): void {
        this.dataSource = new MatTableDataSource(ELEMENT_DATA);
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.paginator._intl.itemsPerPageLabel = 'عدد الوحدات في الصفحة';
        this.paginator._intl.nextPageLabel = 'الصفحة التالية';
        this.paginator._intl.firstPageLabel = 'الصفحة الأولى';
        this.paginator._intl.previousPageLabel = 'الصفحة السابقة';
        this.paginator._intl.lastPageLabel = 'آخر صفحة';


    }

    createJob(): void {
        this._router.navigate(['jobs/create']);
    }

    goToJob(): void {
        this._router.navigate(['jobs/details']);
    }
}
