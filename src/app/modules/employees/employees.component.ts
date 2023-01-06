import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Service} from "../service/service";
import {Employee} from "../models/model";
import {MatTableDataSource} from "@angular/material/table";
import moment from "moment";
import {MatPaginator} from "@angular/material/paginator";
import {ToastrService} from "ngx-toastr";
import {FuseConfirmationService} from "../../../@fuse/services/confirmation";


@Component({
    selector: 'app-employees',
    templateUrl: './employees.component.html',
    styleUrls: ['./employees.component.scss']
})

export class EmployeesComponent {
    showFiller = false;
    createUserForm: FormGroup;
    selectedEmployee: Employee = {} as Employee;
    employees: Employee[] = [];
    @ViewChild('paginator') paginator: MatPaginator;
    isEdit: boolean = false;
    dataSource: MatTableDataSource<any>;
    displayedColumns: string[] = ['number', 'id', 'name', 'email', 'created_at', 'updated_at', 'action'];

    constructor(private _formBuilder: FormBuilder,
                private _toaster: ToastrService,
                private _fuseConfirmationService: FuseConfirmationService,
                private _service: Service) {
    }

    ngOnInit(): void {
        this.getEmployees();
        this.createUserForm = this._formBuilder.group({
            name: ['', Validators.required],
            email: ['', Validators.required],
            password: ['', Validators.required],
        });
    }

    getEmployees(): any {
        this._service.getEmployees_API().subscribe((response) => {
            if (response) {
                this.employees = response;
                this.employees.sort((b, a) => moment(a.created_at, 'YYYY-MM-DD hh:mm:ss a').unix() - moment(b.created_at, 'YYYY-MM-DD hh:mm:ss a').unix());
                this.dataSource = new MatTableDataSource<Employee>(this.employees);
                this.dataSource.paginator = this.paginator;
                this.paginator._intl.itemsPerPageLabel = 'عدد الوحدات في الصفحة';
                this.paginator._intl.nextPageLabel = 'الصفحة التالية';
                this.paginator._intl.firstPageLabel = 'الصفحة الأولى';
                this.paginator._intl.previousPageLabel = 'الصفحة السابقة';
                this.paginator._intl.lastPageLabel = 'آخر صفحة';
            }
        }, error => {
            console.log('error', error.error.message);
            this._toaster.warning('هناك خطأ ما');
        });
    }

    uploadEmployee(): void {
        const body: Employee = {
            name: this.createUserForm.get('name').value,
            email: this.createUserForm.get('email').value,
        }
        this._service.addEmployee_API(body).subscribe((response) => {
            this.employees = response;
        })
    }

    addEmployee():void{
        this.createUserForm.reset();
        this.showFiller = !this.showFiller;
    }

    updateEmployee(id): void {
        const body: Employee = {
            name: this.createUserForm.get('name').value,
            email: this.createUserForm.get('email').value,
        }
        this._service.updateEmployee_API(this.selectedEmployee.id,body).subscribe((response) => {
            this.employees = response;
        })
    }

    deleteEmployee(id): void {
        const confirmation = this._fuseConfirmationService.open({
            title: 'حذف الموظف',
            message: 'هل أنت متأكد أنك تريد حذف هذا الموظف؟ لا يمكن التراجع عن الإجراء الحالي!',
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

                this._service.deleteEmployee_API(id).subscribe((response) => {
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

    editEmployee(employee: Employee): void {
        this.selectedEmployee = employee;
        this.showFiller = !this.showFiller;
        console.log('row', employee);
        this.isEdit = true;
        this.createUserForm.get('name').setValue(employee.name);
        this.createUserForm.get('email').setValue(employee.email);

    }

    private reset() {
        this.showFiller = false;
        this.createUserForm.reset();
        this.isEdit = false;
        this.getEmployees();
    }
}
