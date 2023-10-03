import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {ImageService} from "../service/image.service";

@Component({
    selector: 'app-image-dialog',
    templateUrl: './image-dialog.component.html',
    styleUrls: ['./image-dialog.component.scss']
})

export class ImageDialogComponent implements OnInit {
    imageId: string = '';
    private imgData: string;

    constructor(
        private _imageService: ImageService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {

    }

    ngOnInit(): void {
        console.log('this.data', this.data.id);
        this.imageId = this.data.id;
    }


    downloadImg() {
        const imgUrl = 'https://tawafat-api.walhalabi.com/api/attach/' + this.imageId;
        this._imageService
            .getData(imgUrl)
            .subscribe(imgData => (this.imgData = imgData), err => console.log(err));
        this._imageService.download(this.imgData);
    }

}
