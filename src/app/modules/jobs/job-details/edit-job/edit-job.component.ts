import {Component, ElementRef, ViewChild} from '@angular/core';
import {GoogleMap, MapGeocoder} from "@angular/google-maps";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {Service} from "../../../service/service";
import {Category, Employee, Job, JobType, LocationDetails} from "../../../models/model";
import moment from "moment";
import MapTypeId = google.maps.MapTypeId;
import {ToastrService} from "ngx-toastr";

@Component({
    selector: 'app-edit-job',
    templateUrl: './edit-job.component.html',
    styleUrls: ['./edit-job.component.scss']
})
export class EditJobComponent {
    @ViewChild('mapSearchField') searchField: ElementRef;
    @ViewChild(GoogleMap) map: GoogleMap;
    zoom: number = 17;
    center: google.maps.LatLngLiteral;
    display: google.maps.LatLngLiteral;
    markerOptions: google.maps.MarkerOptions = {draggable: true};
    markerPosition: google.maps.LatLngLiteral = {lat: 0, lng: 0};
    options: google.maps.MapOptions = {
        center: {lat: 24.7419037, lng: 46.6437651},
        zoom: 17,
        mapTypeId: MapTypeId.TERRAIN,
        streetViewControl: false,

    };
    minDate: string | Date = moment(new Date()).format('YYYY-MM-DD hh:mm a');
    editJobForm: FormGroup;
    editMapForm: FormGroup;
    jobId: string = '';
    jobDetails: Job = {} as Job;
    categories: Category[] = [];
    employees: Employee[] = [];
    circleOptions: google.maps.CircleOptions = {
        center: {lat: 24.7419037, lng: 46.6437651},
        radius: 50,
        visible: true,
        strokeColor: '#a17a3f',
        fillColor: '#a17a3f',
    };
    radius: number = 50;
    private location: LocationDetails = {} as LocationDetails;
    private category: Category = {} as Category;
    private employee: Employee = {} as Employee;
    jobTypes: JobType [] = {} as JobType[];
    gallery: boolean;
    gps: boolean;



    constructor(private _router: Router,
                private _formBuilder: FormBuilder,
                private geocoder: MapGeocoder,
                private _service: Service,
                private _route: ActivatedRoute,
                private _toaster: ToastrService,
    ) {
    }

    ngOnInit(): void {
        this.initForm();
        this.initJobTypes();
        this.getEmployees();
        this._route.url.subscribe(() => {
            const routeSnapshot = this._route.snapshot;
            this.jobId = routeSnapshot.params.jobId;
        });
        this._service.getJobById_API(this.jobId).subscribe((response) => {
            if (response) {
                this.jobDetails = response;
                this.populateForm();
                const selectedJob = this.jobTypes.find(job => job.slug === this.editJobForm.get('type').value);
                if (selectedJob) {
                    this.editJobForm.get('type').setValue(selectedJob.id, {emitEvent: false});
                }
            }
        }, error => {
            this._toaster.warning('هناك خطأ ما');
        });

    }



    initForm(): void {
        this.editJobForm = this._formBuilder.group({
            name: ['', Validators.required],
            type: ['', Validators.required],
            gps: ['', Validators.required],
            gallery: ['', Validators.required],
            start_date: ['', Validators.required],
            end_date: ['', Validators.required],
            description: ['', Validators.required],
            assigned_to: ['', Validators.required],
            location_lat: [''],
            radius: ['50'],
            location_lng: [''],
        });
        this.editMapForm = this._formBuilder.group({
            location_address: ['', Validators.required],
            radius: ['50', Validators.required]
        });
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            const searchBox = new google.maps.places.SearchBox(
                this.searchField?.nativeElement
            );

            searchBox.addListener('places_changed', () => {
                const places = searchBox.getPlaces();
                if (places.length === 0) {
                    return;
                }
                const bounds = new google.maps.LatLngBounds();
                places.forEach(place => {
                    if (!place.geometry || !place.geometry.location) {
                        return;
                    }
                    if (place.geometry.viewport) {
                        bounds.union(place.geometry.viewport);
                    } else {
                        bounds.extend(place.geometry.location);

                    }
                    this.map.fitBounds(bounds);

                    if (place.geometry.location) {
                        this.addMarker({latLng: place.geometry.location});
                        this.circleOptions = {
                            center: {lat: this.markerPosition.lat, lng: this.markerPosition.lng},
                            radius: this.radius,
                            visible: true,
                            strokeColor: '#a17a3f',
                            fillColor: '#a17a3f',
                        };
                        this.map.zoom = 17;
                        this.zoom = 17;

                        this.editMapForm.get('location_lat').setValue(place.geometry.location.lat());
                        this.editMapForm.get('location_lng').setValue(place.geometry.location.lng());
                    }

                });
            });

        }, 100);

    }

    populateForm(): void {
        this.editJobForm.get('name').setValue(this.jobDetails.name);
        this.editJobForm.get('start_date').setValue(this.jobDetails.start_date);
        this.editJobForm.get('end_date').setValue(this.jobDetails.end_date);
        this.editJobForm.get('description').setValue(this.jobDetails.description);
        this.editJobForm.get('type').setValue(this.jobDetails.type);
        this.editJobForm.get('gps').setValue(this.jobDetails.enable_gps);
        this.editJobForm.get('gallery').setValue(this.jobDetails.enable_studio);
        this.editJobForm.get('assigned_to').setValue(this.jobDetails.assigned_to.id);
        this.editMapForm.get('location_address').setValue(this.jobDetails.location.address);
        this.editJobForm.get('location_lat').setValue(this.jobDetails.location.lat);
        this.editJobForm.get('location_lng').setValue(this.jobDetails.location.long);
        // this.editJobForm.get('radius').setValue(this.jobDetails.radius);
        this.gps = this.editJobForm.get('gps').value;
        this.gallery = this.editJobForm.get('gallery').value;
        //Todo: add radius from api here
        this.editMapForm.get('radius').setValue(50);
        const lat = parseFloat(this.editJobForm.get('location_lat').value);
        const lng = parseFloat(this.editJobForm.get('location_lng').value)
        this.markerPosition = {lat: lat, lng: lng};
        this.center = {lat: lat, lng: lng};
        this.circleOptions = {
            center: {lat: lat, lng: lng},
            radius: this.radius,
            visible: true,
            strokeColor: '#a17a3f',
            fillColor: '#a17a3f',
        };
        this.employee = this.jobDetails.assigned_to;

    }

    getEmployees(): any {
        this._service.getEmployees_API().subscribe((response) => {
            if (response) {
                this.employees = response;
                const user = localStorage.getItem('user');
                const userObj = JSON.parse(user);
                const adminIndex = this.employees.findIndex((employee) => employee.email === userObj.email);
                this.employees.splice(adminIndex, 1);

            }
        }, error => {
            this._toaster.warning('هناك خطأ ما');
        });
    }

    backToJobs(): void {
        this._router.navigate(['/jobs']);
    }

    addMarker(event: google.maps.MapMouseEvent | { latLng: google.maps.LatLng }) {
        this.markerPosition = event.latLng.toJSON();
        this.geocoder.geocode({
            location: {lat: this.markerPosition.lat, lng: this.markerPosition.lng}
        }).subscribe(({results}) => {
            this.updateRadius();
            this.editMapForm.get('location_lat')?.setValue(this.markerPosition.lat);
            this.editMapForm.get('location_lng')?.setValue(this.markerPosition.lng);
            if (results[1]) {
                this.editMapForm.controls.location_address.setValue(results[1].formatted_address);
            } else if (results[0]) {
                this.editMapForm.controls.location_address.setValue(results[0].formatted_address);
            }
        });


    }

    move(event: google.maps.MapMouseEvent): void {
        this.display = event.latLng.toJSON();
    }

    formatDate(): void {
        const start_date = this.editJobForm.get('start_date').value;
        this.editJobForm.get('start_date').setValue(moment(start_date).format('YYYY-MM-DD hh:mm:ss'));
        const end_date = this.editJobForm.get('end_date').value;
        this.editJobForm.get('end_date').setValue(moment(end_date).format('YYYY-MM-DD hh:mm:ss'));
    }

    setLocation() {
        this.location.lat = this.markerPosition.lat.toString();
        this.location.long = this.markerPosition.lng.toString();
        this.location.address = this.editMapForm.get('location_address').value;
    }

    saveJob(): void {
        this.formatDate();
        this.setLocation();
        const body: Job = {
            assigned_to: this.employee,
            name: this.editJobForm.get('name').value,
            assigned_to_id: this.employee.id,
            location: this.location,
            enable_gps: this.gps,
            enable_studio: this.gallery,
            end_date: this.editJobForm.get('end_date').value,
            start_date: this.editJobForm.get('start_date').value,
            status: this.jobDetails?.status || 'inactive',
            description: this.editJobForm.get('description').value,
            type: this.editJobForm.get('type').value,
            // radius: this.editJobForm.get('radius').value

        }
        this._service.updateJob_API(this.jobId, body).subscribe((response) => {
            if (response) {
                this._toaster.success('تمت إضافة المهام بنجاح');
                this.reset();
            }
        }, error => {
            this._toaster.warning(error.error.message);
        });


    }

    setEmployee(employee: Employee) {
        this.employee = employee;
    }

    updateRadius() {
        this.radius = this.editMapForm.get('radius').value;
        this.circleOptions = {
            center: {lat: this.markerPosition.lat, lng: this.markerPosition.lng},
            radius: this.radius,
            visible: true,
            strokeColor: '#a17a3f',
            fillColor: '#a17a3f',
        };
    }

    setMinDate(status: 'Open' | 'Closed'): void {
        if (status === 'Open') {
            this.minDate = new Date();
        }
        if (status === 'Closed') {
            this.minDate = this.editJobForm.get('start_date').value;
        }
    }

    private reset(): void {
        this.editJobForm.reset();
        this.editMapForm.reset();
        this.initForm();
        this.getEmployees();
        this._route.url.subscribe(() => {
            const routeSnapshot = this._route.snapshot;
            this.jobId = routeSnapshot.params.jobId;
        });
        this._service.getJobById_API(this.jobId).subscribe((response) => {
            this.jobDetails = response;
            this.populateForm();
        })
    }

    setJobType(job) {
        this.editJobForm.get('type').setValue(job.slug);
    }

    private initJobTypes() {
        this.jobTypes = [
            {
                id: '1',
                name_ar: 'زيارة طعام',
                slug: 'visit_food',
            },
            {
                id: '2',
                name_ar: 'زيارة باب',
                slug: 'visit_gate'
            },
            {
                id: '3',
                name_ar: 'زيارة المخيم',
                slug: 'visit_camp'
            }
        ]
    }

    private getJobTypeId(type: string) {
        switch (type) {
            case 'visit_food':
                return '1'
            case 'visit_gate':
                return '2'
            case 'visit_camp':
                return '3'
        }
    }

    setGalleryMode() {
        this.gallery = !this.gallery;
    }

    setGpsMode() {
        this.gps = !this.gps;
    }
}
