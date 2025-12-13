import { Component } from '@angular/core';
import { IonContent, IonButton, IonIcon } from '@ionic/angular/standalone'; // ✅ IonIcon importado
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, IonButton, IonIcon, RouterModule] // ✅ IonIcon en imports
})
export class LoginPage {
  constructor() {}

  noConozcoMiCuenta() {
    alert('Pronto te ayudaremos a recuperar tu cuenta. Por ahora, revisa tu correo.');
  }

  alertaModoVoz() {
    alert('Modo Voz: Próximamente disponible para personas con discapacidad visual.');
  }
}
