// src/app/tabs/tabs.page.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit, OnDestroy {
  private authSub!: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Escuchar el email actual y redirigir si es admin
    this.authSub = this.authService.currentUserEmail$.subscribe(email => {
      if (email === 'administrador@duocuc.cl') {
        this.router.navigate(['/admin-dashboard']);
      }
    });
  }

  ngOnDestroy() {
    if (this.authSub) this.authSub.unsubscribe();
  }
}
