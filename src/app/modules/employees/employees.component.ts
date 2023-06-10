import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Service} from "../service/service";
import {Employee} from "../models/model";
import {MatTableDataSource} from "@angular/material/table";
import moment from "moment";
import {MatPaginator} from "@angular/material/paginator";
import {ToastrService} from "ngx-toastr";
import {FuseConfirmationService} from "../../../@fuse/services/confirmation";
import {FuseValidators} from "../../../@fuse/validators";
import {AuthService} from "../../core/auth/auth.service";
import {UserService} from "../../core/user/user.service";


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
    isReadOnly: boolean = false;

    constructor(private _formBuilder: FormBuilder,
                private _toaster: ToastrService,
                private _auth: UserService,
                private _fuseConfirmationService: FuseConfirmationService,
                private _service: Service) {
    }

    ngOnInit(): void {
        this.getEmployees();
        this.createUserForm = this._formBuilder.group({
                name: ['', Validators.required],
                email: ['', Validators.required],
                password: ['', Validators.required],
                confirm_password: ['', Validators.required]
            },
            {
                validators: FuseValidators.mustMatch('password', 'confirm_password')
            });

    }

    getEmployees(): any {
        this._service.getEmployees_API().subscribe((response) => {
            if (response) {
                this.employees = response;

                this.employees.sort((b, a) => moment(a.created_at, 'YYYY-MM-DD hh:mm:ss a').unix() - moment(b.created_at, 'YYYY-MM-DD hh:mm:ss a').unix());
                const user = localStorage.getItem('user');
                const userObj = JSON.parse(user);
                const adminIndex = this.employees.findIndex((employee) => employee.email === userObj.email);
                this.employees.splice(adminIndex,1);
                this.dataSource = new MatTableDataSource<Employee>(this.employees);
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

    uploadEmployee(): void {
        const body: Employee = {
            name: this.createUserForm.get('name').value,
            email: this.createUserForm.get('email').value,
            password: this.createUserForm.get('password').value,
            password_confirmation: this.createUserForm.get('confirm_password').value,
        }
        this._service.addEmployee_API(body).subscribe((response) => {
            this.employees = response;
            this._toaster.success('تم إنشاء الموظف بنجاح');
            this.reset();
        }, error => {
            this._toaster.warning("هناك خطأ ما.! تأكد من عدم أخذ البريد الإلكتروني من قبل");
        })
    }

    addEmployee(): void {
        this.isEdit = false;
        this.isReadOnly = false;
        this.createUserForm.reset();
        this.showFiller = !this.showFiller;
    }

    updateEmployee(): void {
        const body: Employee = {
            name: this.createUserForm.get('name').value,
            password: this.createUserForm.get('password').value,
            password_confirmation: this.createUserForm.get('confirm_password').value,
        }
        this._service.updateEmployee_API(this.selectedEmployee.id, body).subscribe((response) => {
            if (response) {
                this.employees = response;
                this._toaster.success('تم تحديث الموظف بنجاح');
                this.reset();
            }
        }, error => {
            this._toaster.warning("هناك خطأ ما.!");
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
        this.isReadOnly = true;
        this.selectedEmployee = employee;
        this.showFiller = !this.showFiller;
        this.isEdit = true;
        this.createUserForm.get('name').setValue(employee.name);
        this.createUserForm.get('email').setValue(employee.email);
        this.createUserForm.get('password').reset();
        this.createUserForm.get('confirm_password').reset();
    }

    private reset() {
        this.showFiller = false;
        this.createUserForm.reset();
        this.isEdit = false;
        this.getEmployees();
    }
}
