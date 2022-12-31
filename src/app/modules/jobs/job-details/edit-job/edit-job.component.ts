import {Component, ElementRef, ViewChild} from '@angular/core';
import {GoogleMap, MapGeocoder} from "@angular/google-maps";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
    selector: 'app-edit-job',
    templateUrl: './edit-job.component.html',
    styleUrls: ['./edit-job.component.scss']
})
export class EditJobComponent {
    @ViewChild('mapSearchField') searchField: ElementRef;
    @ViewChild(GoogleMap) map: GoogleMap;
    zoom: number = 12;
    center: google.maps.LatLngLiteral;
    display: google.maps.LatLngLiteral;
    markerOptions: google.maps.MarkerOptions = {draggable: true};
    markerPosition: google.maps.LatLngLiteral = {lat: 0, lng: 0};
    options: google.maps.MapOptions = {
        center: {lat: 24.7419037, lng: 46.6437651},
        zoom: 4

    };

    editJobForm: FormGroup;
    editMapForm: FormGroup;

    constructor(private _router: Router,
                private _formBuilder: FormBuilder,
                private geocoder: MapGeocoder,
    ) {
    }

    ngOnInit(): void {
        this.editJobForm = this._formBuilder.group({
            name: ['', Validators.required],
            category: ['', Validators.required],
            start_date: ['', Validators.required],
            end_date: ['', Validators.required],
            description: ['', Validators.required],
            assigned_to: ['', Validators.required],

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
        this.editJobForm.controls.location_lat.setValue(this.markerPosition.lat);
        this.editJobForm.controls.location_lng.setValue(this.markerPosition.lng);


        this.geocoder.geocode({
            location: {lat: this.markerPosition.lat, lng: this.markerPosition.lng}
        }).subscribe(({results}) => {
            if (results[1]) {
                this.editJobForm.controls.location_address.setValue(results[1].formatted_address);
            } else if (results[0]) {
                this.editJobForm.controls.location_address.setValue(results[0].formatted_address);
            }
        });


    }

    move(event: google.maps.MapMouseEvent): void {
        this.display = event.latLng.toJSON();
    }

    saveJob(): void {

    }
}
