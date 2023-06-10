import {Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {
    ChartComponent,
    ApexOptions
} from "ng-apexcharts";
import {User} from "../../core/user/user.types";
import {Service} from "../service/service";
import {Dashboard} from "../models/model";
import {ToastrService} from "ngx-toastr";
import {DataSource} from "@angular/cdk/collections";
import {MatTableDataSource} from "@angular/material/table";
import {MatTabChangeEvent} from "@angular/material/tabs";
import {Router} from "@angular/router";
import {MatPaginator} from "@angular/material/paginator";


@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
    @ViewChild("chart") chart: ChartComponent;
    public user: User;
    public pieChartOptions: Partial<ApexOptions>;

    dashboard: Dashboard = {} as Dashboard;
    dataSourceFoodVisit: MatTableDataSource<any>;
    dataSourceGateVisit: MatTableDataSource<any>;
    dataSourceCampVisit: MatTableDataSource<any>;
    @ViewChild('campPaginator') campPaginator: MatPaginator;
    @ViewChild('foodPaginator') foodPaginator: MatPaginator;
    @ViewChild('gatePaginator') gatePaginator: MatPaginator;
    displayedColumnsFoodVisit: string[] = ['id', 'date_time', 'no_of_packages', 'rejected_packages', 'min_weight'];
    displayedColumnsGateVisit: string[] = ['id', 'date_time', 'gate_number', 'no_entering', 'no_exiting', 'no_inside'];
    displayedColumnsCampVisit: string[] = ['id', 'date_time', 'camp_number', 'temperature', 'humidity'];

    jobs: any;
    selectedJobType: number = 1;

    constructor(private _service: Service,
                private _router: Router,
                private _toaster: ToastrService) {
    }

    ngOnInit(): void {
        this.dataSourceFoodVisit = new MatTableDataSource<any>();
        this.dataSourceGateVisit = new MatTableDataSource<any>();
        this.dataSourceCampVisit = new MatTableDataSource<any>();
        this.dataSourceCampVisit.paginator = this.campPaginator;
        this.dataSourceGateVisit.paginator = this.gatePaginator;
        this.dataSourceFoodVisit.paginator = this.foodPaginator;
        this.getJobsByType('1');
        this.getDashboardDetails();
        this.user = JSON.parse(localStorage.getItem('user'));
        this.pieChartOptions = {
            dataLabels: {
                enabled: false,
            },
            chart: {
                redrawOnParentResize: true,
                redrawOnWindowResize: true,
                fontFamily: 'inherit',
                foreColor: 'inherit',
                width: 350,
                height: 350,
                type: 'donut',
                sparkline: {
                    enabled: false
                }
            },
            legend: {
                position: 'bottom',
                offsetY: -8,
            },
            colors: ['#4090DB', '#725dcb', '#67DF9C', 'rgba(217,36,36,0.61)'],
            plotOptions: {
                pie: {
                    customScale: 1,
                    expandOnClick: true,
                    donut: {
                        labels: {
                            name: {
                                offsetY: 8,
                            },
                            value: {
                                offsetY: -5, // -8 worked for me
                                show: false,
                            }
                        }
                    }

                }
            },
            series: [25, 25, 25, 25],
            stroke: {
                colors: ['rgba(255,255,255,0.16)']
            },
            labels: ['نشيط', 'قيد التشغيل', 'المكتملة', 'الغير مكتملة'],
            states: {
                hover: {
                    filter: {
                        type: 'none'
                    }
                },
                active: {
                    filter: {
                        type: 'none'
                    }
                }
            },
            tooltip: {
                enabled: true,
                fillSeriesColor: false,
                theme: 'dark',
            }
        };
    }

    ngAfterViewInit(): void {
        if (this.selectedJobType === 1) {
            this.dataSourceFoodVisit = new MatTableDataSource<any>(this.jobs);
        } else if (this.selectedJobType === 2) {
            this.dataSourceGateVisit = new MatTableDataSource<any>(this.jobs);
        } else if (this.selectedJobType === 3) {
            this.dataSourceCampVisit = new MatTableDataSource<any>(this.jobs);
            this.dataSourceCampVisit.paginator = this.campPaginator;
        } else {
            this.dataSourceFoodVisit = new MatTableDataSource<any>(this.jobs);
        }
    }

    private getDashboardDetails(): void {
        this._service.getDashboard_API().subscribe((response) => {
            if (response) {
                this.dashboard = response;
                this.getPieResult();
            }
        }, error => {
            this._toaster.warning('هناك خطأ ما');

        })
    }

    private getJobsByType(job_type: string): void {
        this._service.getJobsByType_API(job_type).subscribe((response) => {
            if (response) {
                this.jobs = response;
                const filteredJobs = this.jobs.filter((job) => job.job_detail !== null);
                this.jobs = filteredJobs;

                if (job_type === '1') {
                    this.dataSourceFoodVisit = new MatTableDataSource<any>(this.jobs);
                    if (this.jobs.length) {
                        this.setPaginator(this.dataSourceFoodVisit);
                    }
                } else if (job_type === '2') {
                    this.dataSourceGateVisit = new MatTableDataSource<any>(this.jobs);
                    if (this.jobs.length) {
                        this.setPaginator(this.dataSourceGateVisit);
                    }
                } else if (job_type === '3') {
                    this.dataSourceCampVisit = new MatTableDataSource<any>(this.jobs);
                    if (this.jobs.length) {
                        this.setPaginator(this.dataSourceCampVisit);
                    }
                } else {
                    this.dataSourceFoodVisit = new MatTableDataSource<any>(this.jobs);
                    if (this.jobs.length) {
                        this.setPaginator(this.dataSourceFoodVisit);
                    }
                }
            }
        }, error => {
            this._toaster.warning('هناك خطأ ما');
        })
    }

    private getPieResult(): void {
        this.pieChartOptions.series = [parseInt(this.dashboard?.pie?.inactive), parseInt(this.dashboard?.pie?.active), parseInt(this.dashboard?.pie?.completed), parseInt(this.dashboard?.pie?.cancelled)];
    }

    private setPaginator(dataSourcePaginator) {
        dataSourcePaginator.paginator = this.campPaginator;
        dataSourcePaginator._intl.itemsPerPageLabel = 'عدد الوحدات في الصفحة';
        dataSourcePaginator._intl.nextPageLabel = 'الصفحة التالية';
        dataSourcePaginator._intl.firstPageLabel = 'الصفحة الأولى';
        dataSourcePaginator._intl.previousPageLabel = 'الصفحة السابقة';
        dataSourcePaginator._intl.lastPageLabel = 'آخر صفحة'
    }

    toggleJobType($event: MatTabChangeEvent) {
        const index = $event.index + 1;
        this.selectedJobType = index;
        console.log(index);
        this.getJobsByType(index.toString());
    }

    openJob(id) {
        this._router.navigate(['jobs/details/' + id]);
    }
}

