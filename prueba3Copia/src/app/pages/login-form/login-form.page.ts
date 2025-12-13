// src/app/pages/login-form/login-form.page.ts
import { Component } from '@angular/core';
import { IonContent, IonButton, IonInput, IonItem, IonLabel } from '@ionic/angular/standalone';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.page.html',
  styleUrls: ['./login-form.page.scss'],
  standalone: true,
  imports: [IonContent, IonButton, IonInput, IonItem, IonLabel, RouterModule, FormsModule, CommonModule]
})
export class LoginFormPage {
  correo = '';
  contrasena = '';

  constructor(private router: Router) {}

  esCorreoValido(): boolean {
    const correo = this.correo.trim().toLowerCase();
    return correo.endsWith('@duocuc.cl') || correo.endsWith('@profesores.duoc.cl'); // ✅ arreglé el dominio
  }

  onSubmit() {
  if (!this.correo || !this.contrasena) {
    alert('Por favor ingresa tu correo y contraseña.');
    return;
  }

  if (!this.esCorreoValido()) {
    alert('Por favor ingresa un correo institucional válido:\n@duocuc.cl o @profesores.duoc.cl');
    return;
  }

  const email = this.correo.trim().toLowerCase();
  localStorage.setItem('currentUserEmail', email);

  // ✅ Redirección inmediata si es admin
  if (email === 'administrador@duocuc.cl') {
    this.router.navigate(['/admin-dashboard']);
  } else {
    this.router.navigate(['/inicio']);
  }
}
}