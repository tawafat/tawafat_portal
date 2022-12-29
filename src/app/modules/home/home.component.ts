import {Component, ViewChild} from '@angular/core';
import {
    ChartComponent,
    ApexAxisChartSeries,
    ApexChart,
    ApexXAxis,
    ApexTitleSubtitle, ApexDataLabels, ApexLegend, ApexPlotOptions, ApexStroke, ApexOptions
} from "ng-apexcharts";


@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent {
    @ViewChild("chart") chart: ChartComponent;
    public chartOptions: Partial<ApexOptions>;
    public pieChartOptions: Partial<ApexOptions>;

    constructor() {
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
            colors: ['#F2B344', '#67DF9C', '#3E8DF3'],
            plotOptions: {
                pie: {
                    customScale: 1,
                    expandOnClick: true,
                    donut: {
                        labels: {
                            name: {
                                offsetY: 8,
                            },
                            show: true,
                            total: {
                                show: true,
                                showAlways: true,
                                fontSize: '22px',

                                fontFamily: 'Helvetica, Arial, sans-serif',
                                fontWeight: 600,
                                label: '25%',
                            },
                            value: {
                                offsetY: -5, // -8 worked for me
                                show: false,
                            }
                        }
                    }

                }
            },
            series: [20, 50, 30 ],

            stroke: {
                colors: ['rgba(255,255,255,0.16)']
            },
            labels: ['قيد التشغيل', 'قيد الانتظار', 'مكتملة'],
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

}
