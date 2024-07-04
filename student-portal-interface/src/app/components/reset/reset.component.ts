import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ResetPasswordService } from '../../services/reset-password.service';
import { ResetPassword } from '../../models/reset-password.model';
import { ConfirmPasswordValidator } from '../../helpers/confirm-password.validator';
import ValidateForm from '../../helpers/validateform';
import * as alertifyjs from 'alertifyjs';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm!: FormGroup;
  emailToReset!: string;
  emailToken!: string;
  resetPasswordObj = new ResetPassword();
  constructor(private fb: FormBuilder, private activated: ActivatedRoute,
    private router: Router,
    private resetPasswordService: ResetPasswordService) { }

  ngOnInit(): void {
    this.resetPasswordForm = this.fb.group({
      password: [null, Validators.required],
      confirmPassword: [null, Validators.required]
    },
      {
        validator: ConfirmPasswordValidator("password", "confirmPassword")
      });
    this.activated.queryParams.subscribe(val => {
      console.log(val);
      this.emailToReset = val['email'];
      let uriToken = (val['code']);
      this.emailToken = uriToken.replace(/ /g, '+');
      console.log(this.emailToken)
    });
  }
  reset() {
    if (this.resetPasswordForm.valid) {
      this.resetPasswordObj.email = this.emailToReset;
      this.resetPasswordObj.newPassword = this.resetPasswordForm.value.password;
      this.resetPasswordObj.confirmPassword = this.resetPasswordForm.value.confirmPassword;
      this.resetPasswordObj.emailToken = this.emailToken;
      this.resetPasswordService.resetEmail(this.resetPasswordObj)
        .subscribe({
          next: (res) => {
            alertifyjs.set('notifier','position', 'top-right');
            alertifyjs.success("Link to reset password is sent succesfully");
            // this.toast.success({
            //   detail: 'SUCCESS',
            //   summary: res.message,
            //   duration: 3000,
            // });
            this.router.navigate(['/'])
          },
          error: (err) => {
            // this.toast.error({
            //   detail: 'SUCCESS',
            //   summary: "Something went wrong",
            //   duration: 3000,
            // });
          }
        })
    } else {
      ValidateForm.validateAllFormFields(this.resetPasswordForm);
    }
  }
}