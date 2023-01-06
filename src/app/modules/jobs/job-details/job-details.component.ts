import {Component, ElementRef, ViewChild} from '@angular/core';
import {GoogleMap, MapGeocoder} from "@angular/google-maps";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {Service} from "../../service/service";
import {Complain, Job} from "../../models/model";
import {FuseConfirmationService} from "../../../../@fuse/services/confirmation";
import {Toast, ToastrService} from "ngx-toastr";

@Component({
    selector: 'app-job-details',
    templateUrl: './job-details.component.html',
    styleUrls: ['./job-details.component.scss']
})
export class JobDetailsComponent {
    @ViewChild('mapSearchField') searchField: ElementRef;
    @ViewChild(GoogleMap) map: GoogleMap;
    public jobDetail: Job = {} as Job;

    complains: Complain[] = [];
    private jobId: string = '';
    radius: number = 50;

    constructor(private _router: Router,
                private _formBuilder: FormBuilder,
                private geocoder: MapGeocoder,
                private _service: Service,
                private _route: ActivatedRoute,
                private _fuseConfirmationService: FuseConfirmationService,
                private _toaster : ToastrService,
    ) {
    }

    ngOnInit(): void {
        this._route.url.subscribe(() => {
            const routeSnapshot = this._route.snapshot;
            this.jobId = routeSnapshot.params.jobId;
        });
        this.getJobDetail();
    }

    backToJobs(): void {
        this._router.navigate(['/jobs']);
    }

    editJob(): void {
        debugger
        this._router.navigate(['jobs/details/update/' + this.jobId]);
    }

    private getJobDetail(): void {
        this._service.getJobById_API(this.jobId).subscribe((response) => {
            if (response) {
                this.jobDetail = response;
                this.complains = this.jobDetail.complains;
                console.log('response', this.complains);
            }
        })
    }

    parseFloat(coordinate: string): number {
        return parseFloat(coordinate);
    }

    deleteJob(): void{
        const confirmation = this._fuseConfirmationService.open({
            title: 'حذف الوظيفة',
            message: 'هل أنت متأكد أنك تريد حذف هذه الوظيفة؟ لا يمكن التراجع عن الإجراء الحالي!',
            actions: {
                confirm: {
                    label: 'حذف'
                }
            }
        });
        confirmation.afterClosed().subscribe((result) => {

            // If the confirm button pressed...
            if (result === 'confirmed') {

                this._service.deleteJob_API(this.jobId).subscribe((response) => {
                    if (response) {
                        this._toaster.success('تم حذف الفئة بنجاح');
                        this._router.navigate(['/jobs']);
                    }
                }, error => {
                    this._toaster.warning(error.error.message);
                });
            }
        });

    }
}
