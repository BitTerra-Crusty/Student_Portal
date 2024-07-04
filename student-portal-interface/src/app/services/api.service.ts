import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl: string  = "https://localhost:7099/api/User/" //this is the base URI/URL

  constructor(private http : HttpClient, private router: Router) {
  }

  getusers(){

    return this.http.get<any>(`${this.baseUrl}Users`);
  }

}
