import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as alertifyjs from 'alertifyjs';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  editForm!: FormGroup
  users: any = [];

  constructor(private fb: FormBuilder, private auth: AuthService, private api: ApiService, private router: Router){}

  ngOnInit(): void {

    this.api.getusers()
    .subscribe(res=>{
      this.users = res;
    })
  }

  onEdit(){
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
