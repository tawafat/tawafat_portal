import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {HttpClient} from "@angular/common/http";
import {Service} from "../service/service";
import {ToastrService} from "ngx-toastr";
import {FuseConfirmationService} from "../../../@fuse/services/confirmation";
import {Category} from "../models/model";
import moment from "moment/moment";

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
    showFiller: boolean = false;
    createCategoryForm: FormGroup;
    @ViewChild('paginator') paginator: MatPaginator;
    dataSource: MatTableDataSource<any>;

    categories: Category[] = [];
    currentRecord: Category;
    displayedColumns: string[] = ['number', 'slug', 'name', 'description', 'created_at', 'action'];
    public isEdit: boolean = false;

    constructor(private _formBuilder: FormBuilder, private _fuseConfirmationService: FuseConfirmationService, private _httpClient: HttpClient, private _service: Service, private _toaster: ToastrService) {
    }

    ngOnInit(): void {
        this.createCategoryForm = this._formBuilder.group({

            slug: ['', Validators.required],
            name: ['', Validators.required],
            description: ['', Validators.required],
        });
        this.reset();
    }

    addCategory() {
        this.createCategoryForm.reset();
        this.isEdit = false;
        this.showFiller = !this.showFiller;
    }

    uploadCategory(): any {
        this._service.addCategory_API({
            name: this.createCategoryForm.get('name').value,
            slug: this.createCategoryForm.get('slug').value,
            description: this.createCategoryForm.get('description').value
        }).subscribe((response) => {
            if (response) {
                this._toaster.success('تمت إضافة الفئة بنجاح');
                this.showFiller = false;
                this.reset();
            }
        }, error => {
            this._toaster.warning(error.error.message);
        });
    }

    deleteCategory(id: string): any {
        const confirmation = this._fuseConfirmationService.open({
            title: 'حذف الفئة',
            message: 'هل أنت متأكد أنك تريد حذف هذه الفئة؟ لا يمكن التراجع عن هذا الإجراء!',
            actions: {
                confirm: {
                    label: 'حذف'
                }
            }
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {

            // If the confirm button pressed...
            if (result === 'confirmed') {

                this._service.deleteCategory_API(id).subscribe((response) => {
                    if (response) {
                        this._toaster.success('تم حذف الفئة بنجاح');
                        this.reset();
                    }
                }, error => {
                    this._toaster.warning(error.error.message);
                });
            }
        });
    }

    getCategories(): any {
        this._service.getCategories_API().subscribe((response) => {
            if (response) {
                this.categories = response;
                this.categories.sort((b, a) => moment(a.created_at, 'YYYY-MM-DD hh:mm:ss a').unix() - moment(b.created_at, 'YYYY-MM-DD hh:mm:ss a').unix());
                this.dataSource = new MatTableDataSource<Category>(this.categories);
                this.dataSource.paginator = this.paginator;
                this.paginator._intl.itemsPerPageLabel = 'عدد الوحدات في الصفحة';
                this.paginator._intl.nextPageLabel = 'الصفحة التالية';
                this.paginator._intl.firstPageLabel = 'الصفحة الأولى';
                this.paginator._intl.previousPageLabel = 'الصفحة السابقة';
                this.paginator._intl.lastPageLabel = 'آخر صفحة';
            }
        }, error => {
            this._toaster.warning('هناك خطأ ما');
        });
    }

    private reset(): void {
        this.showFiller = false;
        this.isEdit = false;
        this.createCategoryForm.reset();
        this.getCategories();
        this.currentRecord = null;

    }

    editCategory(data: Category): void {
        this.isEdit = true;
        this.currentRecord = data;
        this.createCategoryForm.get('slug').setValue(data.slug);
        this.createCategoryForm.get('name').setValue(data.name);
        this.createCategoryForm.get('description').setValue(data.description);
        this.showFiller = !this.showFiller;

    }

    updateCategory(): void {
        this.currentRecord.slug = this.createCategoryForm.get('slug').value;
        this.currentRecord.name = this.createCategoryForm.get('name').value;
        this.currentRecord.description = this.createCategoryForm.get('description').value;
        this._service.updateCategory_API(this.currentRecord.id, this.currentRecord).subscribe((response) => {
                if (response) {
                    this._toaster.success('تم تحديث الفئة بنجاح');
                    this.reset();
                }
            },
            error => {
                this._toaster.warning(error.error.message);
            });
    }
}
