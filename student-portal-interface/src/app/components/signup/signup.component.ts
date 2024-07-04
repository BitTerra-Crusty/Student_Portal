import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import * as alertifyjs from 'alertifyjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit {

  signUpForm!: FormGroup
  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router){}

  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  onSubmit(){
    if(this.signUpForm.valid){
      //send obj to DB
      console.log(this.signUpForm.value);

      this.auth.signUp(this.signUpForm.value)
      .subscribe({
        next:(res)=>{
          try{

            alertifyjs.set('notifier','position', 'top-right');
            alertifyjs.success(res.message);
            this.signUpForm.reset();
            this.router.navigate(['login'])
          }catch{
            this.validateAllFormFields(this.signUpForm);
            alertifyjs.set('notifier','position', 'top-right');
            alertifyjs.error("Opps something went wrong, please try again later");
          }
        

        },
        error:(err)=>{
          alertifyjs.set('notifier','position', 'top-right');
          alertifyjs.error(err?.error.message);
        }
      })
    }
    else{
      //through error
     this.validateAllFormFields(this.signUpForm);
     alertifyjs.set('notifier','position', 'top-right');
     alertifyjs.error("Opps something went wrong, please try again later");
    }
  }

  private validateAllFormFields(formGroup:FormGroup){
    Object.keys(formGroup.controls).forEach(field =>
      {
        const control = formGroup.get(field);
        
        if(control instanceof FormControl){
          control.markAsDirty({onlySelf: true});
          // console.log(control)
        }
        else if(control instanceof FormGroup){
          this.validateAllFormFields(control);
        }
      }
    )
  }
}
