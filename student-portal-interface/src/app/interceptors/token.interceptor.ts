import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import * as alertifyjs from 'alertifyjs';
import { Router } from '@angular/router';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {

  const auth = inject(AuthService);
  const router = inject(Router);
  const myToken = auth.getToken();

  if(myToken){
    req = req.clone({
      setHeaders: {Authorization: `Bearer ${myToken}`} //bearer+token, this modifies my request header
    })
  }

  return next(req).pipe(
    catchError((err:any) => {
        if(err instanceof HttpErrorResponse){
          if(err.status === 401){
            alertifyjs.set('notifier','position', 'top-right');
            alertifyjs.warning("Token is expired, Please login again");
            router.navigate(['login'])
          }
        }

        return throwError(() => new Error("Oops something wrong happened"))
      })
  );
};
