import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import * as alertifyjs from 'alertifyjs';
import { ResetPasswordService } from '../../services/reset-password.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

    type: string = "password";
    isText: boolean = false;
    eyeIcon: string = "fa-eye-slash";
    public resetPasswordEmail!: string;
    public isValidEmail!: boolean;

    user: any;

    loginForm!: FormGroup

    constructor(
      private fb: FormBuilder,
      private auth: AuthService, 
      private router: Router,
      private resetService: ResetPasswordService
    ){}

    ngOnInit(): void {
      this.loginForm = this.fb.group({
        email: ['', Validators.required],
        password: ['', Validators.required]
      })
    }

    hideShowPass(){
      this.isText = !this.isText;
      this.isText ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash"
    }

    onSubmit(){
      if(this.loginForm.valid){
        //send obj to DB
        console.log(this.loginForm.value);

        this.auth.login(this.loginForm.value)
        .subscribe({
          next:(res)=>{
            // alert(res.message);
            alertifyjs.set('notifier','position', 'top-right');
            alertifyjs.success(res.message);
            this.user = res.user;
            localStorage.setItem('user', res.user.firstName+' '+ res.user.lastName)

            console.log("returned user", this.user);
            this.loginForm.reset();
            this.auth.storeToken(res.token);
            this.router.navigate(['dashboard']);

          },
          error:(err)=>{
            // alert(err?.error.message)
            try{
              this.validateAllFormFields(this.loginForm);
              alertifyjs.set('notifier','position', 'top-right');
              alertifyjs.error(err?.error.message);
            }
            catch{
              alertifyjs.set('notifier','position', 'top-right');
              alertifyjs.error("Opps something went wrong, couln't log in Enter the right credencials and try again later");
            }
          
          }
        })
      }
      else{
        //through error
       this.validateAllFormFields(this.loginForm);
      //  alert("Invalid form");
      alertifyjs.set('notifier','position', 'top-right');
      alertifyjs.error("Opps, couln't log in Enter the right credencials");
      }
    }

    private validateAllFormFields(formGroup: FormGroup){
      Object.keys(formGroup.controls).forEach(field =>
        {
          const control = formGroup.get(field);
          if(control instanceof FormControl){
            control.markAsDirty({onlySelf: true});
          }
          else if(control instanceof FormGroup){
            this.validateAllFormFields(control);
          }
        }
      )
    }

    checkValidEmail(event: string){
      const value = event;
      const pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/

      this.isValidEmail = pattern.test(value);

      return this.isValidEmail;
    }
    confirmToSend()
    {
      if(this.checkValidEmail(this.resetPasswordEmail)){
        console.log(this.resetPasswordEmail);

      
        //api call

        this.resetService.sendResetPasswordLink(this.resetPasswordEmail)
        .subscribe({
          next:(res)=>{
            this.resetPasswordEmail = "";

            const buttnRef = document.getElementById("closeBtn");
            buttnRef?.click();
            alertifyjs.set('notifier','position', 'top-right');
            alertifyjs.success("Link to reset password is sent succesfully");
          },
          error:(err)=>{
            alertifyjs.set('notifier','position', 'top-right');
            alertifyjs.error("Email doesn't no exit in our database");
          }
        })
        

      }
    }
}
