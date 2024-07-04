import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import * as alertifyjs from 'alertifyjs';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const auth = inject(AuthService);

  const router = inject(Router);
  
  if (auth.isLoggedIn()) {
    console.log('User is logged in guards');
    return true;
  } else {
    // Optional: handle the unauthorized case, e.g., redirect to login
    router.navigate(['login'])
    console.warn('Access denied - Users not logged in');

    alertifyjs.set('notifier','position', 'top-right');
    alertifyjs.error('Access denied - Users not logged in');
    return false;
  }
};
