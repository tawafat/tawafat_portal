import {Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {Router} from '@angular/router';
import {Service} from '../service/service';
import {Job} from '../models/model';
import {ToastrService} from 'ngx-toastr';

@Component({
    selector: 'app-jobs',
    templateUrl: './jobs.component.html',
    styleUrls: ['./jobs.component.scss'],
})
export class JobsComponent implements OnInit{
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
    createJob(): void {
        this.router.navigate(['jobs/create']);
    }

    getJobs(): void {
        this.service.getJobs_API().subscribe(
            (response) => {
                if (response) {
                    this.jobs = response;
                    this.dataSource.data = response;
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
