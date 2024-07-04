import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string  = "https://localhost:7099/api/User/" //this is the base URI/URL

  constructor(private http : HttpClient, private router: Router) {
   }

   //calls the Register URI(API)
   signUp(UserObj:any){

      return this.http.post<any>(`${this.baseUrl}register`, UserObj)
   }

   //calls the authicate URI(API)
   login(UserObj:any){
    return this.http.post<any>(`${this.baseUrl}authenticate`, UserObj)
   }

   logOut(){
    localStorage.clear(); //clear the stored token
    this.router.navigate(['login']); //navigate to the login
   }

   //this saves the token to our local storage
   storeToken(tokenValue: string){
    localStorage.setItem('token', tokenValue)
   }

   //This gets the stored token value
   getToken()
   {
    return localStorage.getItem('token');
   }

   //Check if user is locked in
   isLoggedIn(): boolean{
    console.log('User is logged in', !!localStorage.getItem('token'));
    return !!localStorage.getItem('token'); //If therre is a token item in the local storage the value will be true otherwise false
   }

}
