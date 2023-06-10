import {Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {Router} from '@angular/router';
import {Service} from '../service/service';
import {Job} from '../models/model';
import {ToastrService} from 'ngx-toastr';
import {MatPaginator} from "@angular/material/paginator";

@Component({
    selector: 'app-jobs',
    templateUrl: './jobs.component.html',
    styleUrls: ['./jobs.component.scss'],
})
export class JobsComponent implements OnInit, AfterViewInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    dataSource: MatTableDataSource<Job> = new MatTableDataSource<Job>();
    jobs: Job[] = [];
    displayedColumns: string[] = [
        'status',
        'name',
        'startDate',
        'endDate',
        'assignedBy',
        'complain',
    ];

    constructor(
        private router: Router,
        private service: Service,
        private toaster: ToastrService
    ) {
    }

    ngOnInit(): void {
        this.getJobs();
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.paginator._intl.itemsPerPageLabel = 'عدد الوحدات في الصفحة';
        this.paginator._intl.nextPageLabel = 'الصفحة التالية';
        this.paginator._intl.firstPageLabel = 'الصفحة الأولى';
        this.paginator._intl.previousPageLabel = 'الصفحة السابقة';
        this.paginator._intl.lastPageLabel = 'آخر صفحة';
    }

    createJob(): void {
        this.router.navigate(['jobs/create']);
    }

    getJobs(): void {
        this.service.getJobs_API().subscribe(
            (response) => {
                if (response) {
                    this.jobs = response;
                    this.dataSource.data = response;
                    this.dataSource.paginator = this.paginator;
                }
            },
            (error) => {
                this.toaster.warning('هناك خطأ ما');
            }
        );
    }

    goToJob(job: Job): void {
        this.router.navigate(['jobs/details/' + job.id]);
    }
}
