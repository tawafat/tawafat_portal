import {Component, OnInit, ViewChild} from '@angular/core';
import {
    ChartComponent,
    ApexOptions
} from "ng-apexcharts";
import {User} from "../../core/user/user.types";
import {Service} from "../service/service";
import {Dashboard} from "../models/model";
import {ToastrService} from "ngx-toastr";


@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    @ViewChild("chart") chart: ChartComponent;
    public user: User;
    public chartOptions: Partial<ApexOptions>;
    public pieChartOptions: Partial<ApexOptions>;

    dashboard: Dashboard = {} as Dashboard;

    constructor(private _service: Service,
                private _toaster: ToastrService) {
    }

    ngOnInit(): void {
        this.getDashboardDetails();
        this.user = JSON.parse(localStorage.getItem('user'));
        this.chartOptions = {
            series: [
                {
                    name: "My-series",
                    data: [98, 91, 69, 62, 49, 51, 35, 41, 10]
                }
            ],
            chart: {
                height: 350,
                type: "line"
            },
            xaxis: {
                categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"]
            }
        };
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

    private getDashboardDetails(): void {
        this._service.getDashboard_API().subscribe((response) => {
            if (response) {
                this.dashboard = response;
                this.getPieResult();
            }}, error => {
            this._toaster.warning('هناك خطأ ما');

        })
    }

    private getPieResult(): void {
        this.pieChartOptions.series = [parseInt(this.dashboard?.pie?.inactive), parseInt(this.dashboard?.pie?.active), parseInt(this.dashboard?.pie?.completed), parseInt(this.dashboard?.pie?.cancelled)];
    }
}

