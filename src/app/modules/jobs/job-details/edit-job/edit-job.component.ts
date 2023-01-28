import {Component, ElementRef, ViewChild} from '@angular/core';
import {GoogleMap, MapGeocoder} from "@angular/google-maps";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {Service} from "../../../service/service";
import {Category, Employee, Job, LocationDetails} from "../../../models/model";
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
        this.getCategories();
        this.getEmployees();
        this._route.url.subscribe(() => {
            const routeSnapshot = this._route.snapshot;
            this.jobId = routeSnapshot.params.jobId;
        });
        this._service.getJobById_API(this.jobId).subscribe((response) => {
            if (response){
                this.jobDetails = response;
                this.populateForm();
            }
        }, error => {
            this._toaster.warning('هناك خطأ ما');
        });
    }

    initForm(): void {
        this.editJobForm = this._formBuilder.group({
            name: ['', Validators.required],
            category: ['', Validators.required],
            start_date: ['', Validators.required],
            end_date: ['', Validators.required],
            description: ['', Validators.required],
            assigned_to: ['', Validators.required],
            location_lat: [''],
            location_lng: [''],
        });
        this.editMapForm = this._formBuilder.group({
            location_address: ['', Validators.required],
            radius: ['', Validators.required]
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
                        debugger
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
        this.editJobForm.get('category').setValue(this.jobDetails.category.id);
        this.editJobForm.get('start_date').setValue(this.jobDetails.start_date);
        this.editJobForm.get('end_date').setValue(this.jobDetails.end_date);
        this.editJobForm.get('description').setValue(this.jobDetails.description);
        this.editJobForm.get('assigned_to').setValue(this.jobDetails.assigned_to.id);
        this.editMapForm.get('location_address').setValue(this.jobDetails.location.address);
        this.editJobForm.get('location_lat').setValue(this.jobDetails.location.lat);
        this.editJobForm.get('location_lng').setValue(this.jobDetails.location.long);
        // this.editJobForm.get('radius').setValue(this.jobDetails.radius);
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
        this.category = this.jobDetails.category;
        this.employee = this.jobDetails.assigned_to;

    }

    getCategories(): any {
        this._service.getCategories_API().subscribe((response) => {
            if (response) {
                this.categories = response;
            }
        }, error => {
            this._toaster.warning('هناك خطأ ما');
        });
    }

    getEmployees(): any {
        this._service.getEmployees_API().subscribe((response) => {
            if (response) {
                this.employees = response;
                const user = localStorage.getItem('user');
                const userObj = JSON.parse(user);
                const adminIndex = this.employees.findIndex((employee) => employee.email === userObj.email);
                this.employees.splice(adminIndex,1);

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

        debugger


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
        debugger
        this.location.lat = this.markerPosition.lat.toString();
        this.location.long = this.markerPosition.lng.toString();
        this.location.address = this.editMapForm.get('location_address').value;
    }

    saveJob(): void {
        this.formatDate();
        this.setLocation();
        const body: Job = {
            category: this.category,
            assigned_to: this.employee,
            name: this.editJobForm.get('name').value,
            assigned_to_id: this.employee.id,
            category_slug: this.category.slug,
            location: this.location,
            end_date: this.editJobForm.get('end_date').value,
            start_date: this.editJobForm.get('start_date').value,
            status: this.jobDetails?.status || 'inactive',
            description: this.editJobForm.get('description').value,
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

    setCategory(category: Category) {
        this.category = category;
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
        this.getCategories();
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
}
