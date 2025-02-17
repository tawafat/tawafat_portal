import {Component, ElementRef, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {GoogleMap, MapGeocoder} from "@angular/google-maps";
import moment from "moment/moment";
import {Employee, Job, JobType, LocationDetails} from "../../models/model";
import {Service} from "../../service/service";
import {ToastrService} from "ngx-toastr";

@Component({
    selector: 'app-create-job',
    templateUrl: './create-job.component.html',
    styleUrls: ['./create-job.component.scss']
})
export class CreateJobComponent {
    @ViewChild('mapSearchField') searchField: ElementRef;
    @ViewChild(GoogleMap) map: GoogleMap;
    zoom: number = 18;
    center: google.maps.LatLngLiteral;
    display: google.maps.LatLngLiteral;
    markerOptions: google.maps.MarkerOptions = {draggable: true};
    markerPosition: google.maps.LatLngLiteral = {lat: 0, lng: 0};
    options: google.maps.MapOptions = {
        center: {lat: 24.7419037, lng: 46.6437651},
        zoom: 8,
        streetViewControl: false,

    };

    newJobForm: FormGroup;
    minDate: Date = new Date();
    employees: Employee[] = [];
    employee: Employee = null;
    gps_flag: boolean = false;
    location: LocationDetails = {} as LocationDetails;
    circleOptions: google.maps.CircleOptions = {
        center: {lat: 24.7419037, lng: 46.6437651},
        radius: 50,
        visible: true,
        strokeColor: '#a17a3f',
        fillColor: '#a17a3f',
    };
    private radius: number = 50;
    jobTypes: JobType [] = {} as JobType[];
    studio_flag: boolean = false;

    constructor(private _router: Router,
                private _formBuilder: FormBuilder,
                private geocoder: MapGeocoder,
                private _service: Service,
                private _toaster: ToastrService,
    ) {
    }


    ngOnInit(): void {
        this.initJobTypes();
        /*get employees*/
        this.getEmployees();
        this.newJobForm = this._formBuilder.group({
            name: ['test', Validators.required],
            type: ['', Validators.required],
            start_date: [moment(new Date()), Validators.required],
            end_date: [moment(new Date()), Validators.required],
            description: ['test', Validators.required],
            assigned_to: ['', Validators.required],
            location_address: ['', Validators.required],
            // gps: [this.gps_flag, Validators.required],
            gallery: [this.studio_flag, Validators.required],
            location_lat: [''],
            location_lng: [''],
            radius: ['50', Validators.required],
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
                        this.newJobForm.get('location_lat').setValue(place.geometry.location.lat());
                        this.newJobForm.get('location_lng').setValue(place.geometry.location.lng());
                    }

                });
            });

            this.getLocation();
        }, 100);
    }

    getLocation(): any {

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position: any) => {
                    if (position) {
                        const lat = position.coords.latitude;
                        const lng = position.coords.longitude;
                        this.circleOptions = {
                            center: {lat: lat, lng: lng},
                            radius: this.radius,
                            visible: true,
                            strokeColor: '#a17a3f',
                            fillColor: '#a17a3f',
                        };
                        this.center = {lat: lat, lng: lng};
                        this.markerPosition = {lat: lat, lng: lng};
                    }

                },
                (error: any) => (error));
        } else {
            alert('Geolocation is not supported by this browser.');
        }

    }

    backToJobs(): void {
        this._router.navigate(['/jobs']);
    }

    addMarker(event: google.maps.MapMouseEvent | { latLng: google.maps.LatLng }) {
        this.markerPosition = event.latLng.toJSON();
        this.newJobForm.controls.location_lat.setValue(this.markerPosition.lat);
        this.newJobForm.controls.location_lng.setValue(this.markerPosition.lng);
        this.circleOptions = {
            center: {lat: this.markerPosition.lat, lng: this.markerPosition.lng},
            radius: this.radius,
            visible: true,
            strokeColor: '#a17a3f',
            fillColor: '#a17a3f',
        };


        this.geocoder.geocode({
            location: {lat: this.markerPosition.lat, lng: this.markerPosition.lng}
        }).subscribe(({results}) => {
            if (results[1]) {
                this.newJobForm.controls.location_address.setValue(results[1].formatted_address);
            } else if (results[0]) {
                this.newJobForm.controls.location_address.setValue(results[0].formatted_address);
            }
        });


    }

    getEmployees(): any {
        this._service.getEmployees_API().subscribe((response) => {
            if (response) {
                this.employees = response;
            }
        }, error => {
            this._toaster.warning('هناك خطأ ما');
        });
    }

    move(event: google.maps.MapMouseEvent): void {
        this.display = event.latLng.toJSON();
    }

    saveJob(): void {
        this.formatDate();
        this.setLocation();
        const body: Job = {
            assigned_to: this.employee,
            // enable_gps: this.newJobForm.get('gps').value,
            enable_studio: this.newJobForm.get('gallery').value,
            type: this.newJobForm.get('type').value,
            name: this.newJobForm.get('name').value,
            assigned_to_id: this.employee.id,
            location: this.location,
            end_date: this.newJobForm.get('end_date').value,
            start_date: this.newJobForm.get('start_date').value,
            status: 'inactive',
            description: this.newJobForm.get('description').value,
            // radius: this.newJobForm.get('radius').value
        }
        this._service.createJob_API(body).subscribe((response) => {
            if (response) {
                this._toaster.success('تمت إضافة المهام بنجاح');
                this._router.navigate(['/jobs']);
            }
        }, error => {
            this._toaster.warning(error.error.message);
        });
    }

    formatDate(): void {
        const start_date = this.newJobForm.get('start_date').value;
        this.newJobForm.get('start_date').setValue(moment(start_date).format('YYYY-MM-DD hh:mm:ss'));
        const end_date = this.newJobForm.get('end_date').value;
        this.newJobForm.get('end_date').setValue(moment(end_date).format('YYYY-MM-DD hh:mm:ss'));
    }

    setMinDate(): void {
        this.minDate = this.newJobForm.get('start_date').value;
    }

    setEmployee(employee: Employee) {
        this.employee = employee;
    }

    setLocation() {
        this.location.lat = this.markerPosition.lat.toString();
        this.location.long = this.markerPosition.lng.toString();
        this.location.address = this.newJobForm.get('location_address').value;
    }

    updateRadius(event) {
        this.radius = this.newJobForm.get('radius').value;
        this.circleOptions = {
            center: {lat: this.markerPosition.lat, lng: this.markerPosition.lng},
            radius: this.radius,
            visible: true,
            strokeColor: '#a17a3f',
            fillColor: '#a17a3f',
        };
    }

    setJobType(job: JobType) {
        switch (job.id){
            case '1' :
                this.newJobForm.get('type').setValue(job.id)
            case '2' :
                this.newJobForm.get('type').setValue(job.id)
            case '3' :
                this.newJobForm.get('type').setValue(job.id)
        }
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

    setGPS() {
        this.gps_flag=!this.gps_flag;
        console.log(this.gps_flag);
    }

    setGallery() {
        this.studio_flag=!this.studio_flag;
        console.log(this.studio_flag);
    }
}
