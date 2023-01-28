import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from "@angular/material/table";
import {Router} from "@angular/router";
import {Service} from "../service/service";
import {Job} from "../models/model";
import {ToastrService} from "ngx-toastr";

@Component({
    selector: 'app-jobs',
    templateUrl: './jobs.component.html',
    styleUrls: ['./jobs.component.scss']
})

export class JobsComponent implements OnInit {
    @ViewChild('paginator') paginator: MatPaginator;
    dataSource: MatTableDataSource<Job>;
    jobs: Job[] = [];
    displayedColumns: string[] = ['status', 'name', 'category', 'startDate', 'endDate', 'assignedBy', 'complain'];

    constructor(private _router: Router, private _service:Service, private _toaster: ToastrService) {
    }

    ngOnInit(): void {
        this.dataSource = new MatTableDataSource<Job>();
        this.getJob();
    }

    createJob(): void {
        this._router.navigate(['jobs/create']);
    }

    getJob(): void{
        this._service.getJobs_API().subscribe((response) => {
            if (response){
                this.jobs = response;
                this.dataSource = new MatTableDataSource(this.jobs);
                this.dataSource.paginator = this.paginator;
                this.paginator._intl.itemsPerPageLabel = 'عدد الوحدات في الصفحة';
                this.paginator._intl.nextPageLabel = 'الصفحة التالية';
                this.paginator._intl.firstPageLabel = 'الصفحة الأولى';
                this.paginator._intl.previousPageLabel = 'الصفحة السابقة';
                this.paginator._intl.lastPageLabel = 'آخر صفحة';
            }
        }, error => {
            this._toaster.warning('هناك خطأ ما');
        });
    }

    goToJob(job): void {
        this._router.navigate(['jobs/details/' + job.id]);
    }
}
