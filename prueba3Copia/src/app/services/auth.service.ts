// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { BehaviorSubject, from } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserEmail = new BehaviorSubject<string | null>(null);
  currentUserEmail$ = this.currentUserEmail.asObservable();

  constructor(private afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe(user => {
      if (user?.email) {
        this.currentUserEmail.next(user.email.toLowerCase());
      } else {
        this.currentUserEmail.next(null);
      }
    });
  }

  login(email: string, password: string) {
    return from(this.afAuth.signInWithEmailAndPassword(email, password));
  }

  logout() {
    return this.afAuth.signOut();
  }
}