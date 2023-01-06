import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, NgForm, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseValidators } from '@fuse/validators';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";

@Component({
    selector     : 'change-password',
    templateUrl  : './change-password.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class ChangePasswordComponent implements OnInit
{
    @ViewChild('resetPasswordNgForm') resetPasswordNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: ''
    };
    changePasswordForm: UntypedFormGroup;
    showAlert: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder,
        private _toaster: ToastrService,
        private _router: Router,
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Create the form
        this.changePasswordForm = this._formBuilder.group({
                oldPassword: ['',Validators.required],
                password       : ['', Validators.required],
                passwordConfirm: ['', Validators.required]
            },
            {
                validators: FuseValidators.mustMatch('password', 'passwordConfirm')
            }
        );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Reset password
     */
    changePassword(): void
    {
        // Return if the form is invalid
        if ( this.changePasswordForm.invalid )
        {
            return;
        }

        // Disable the form
        this.changePasswordForm.disable();

        // Hide the alert
        this.showAlert = false;

        // Send the request to the server
        this._authService.changePassword({
            old_password: this.changePasswordForm.get('oldPassword').value,
            password: this.changePasswordForm.get('password').value,
            password_confirmation: this.changePasswordForm.get('passwordConfirm').value
        })
            .pipe(
                finalize(() => {

                    // Re-enable the form
                    this.changePasswordForm.enable();

                    // Reset the form
                    this.resetPasswordNgForm.resetForm();

                    // Show the alert
                    this.showAlert = true;
                })
            )
            .subscribe(
                (response) => {

                    // Set the alert
                    this._toaster.success('تم إعادة تعيين كلمة المرور الخاصة بك');
                    this._router.navigate(['/home']);
                },
                (response) => {

                    // Set the alert
                    this.alert = {
                        type   : 'error',
                        message: 'حدث خطأ ما. أعد المحاولة من فضلك'
                    };
                }
            );
    }
}
