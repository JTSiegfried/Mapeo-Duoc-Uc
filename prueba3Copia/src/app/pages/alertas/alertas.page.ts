// src/app/alertas/alertas.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-alertas',
  templateUrl: './alertas.page.html',
  styleUrls: ['./alertas.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class AlertasPage implements OnInit {
  alertas: { titulo: string; fecha: string }[] = [];

  alertaSeleccionada: any = null;
  isInfoExpanded = false;

  constructor(
    private router: Router,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.cargarHistorialAlertas();
    this.verificarAlertaEmergencia();
  }

  cargarHistorialAlertas() {
    const historial = localStorage.getItem('historialAlertas');
    if (historial) {
      this.alertas = JSON.parse(historial);
    } else {
      this.alertas = [
        { titulo: 'Simulacro', fecha: '29-04-2025' },
        { titulo: 'Simulacro', fecha: '29-11-2024' },
        { titulo: 'Simulacro', fecha: '29-04-2024' },
        { titulo: 'Simulacro', fecha: '29-11-2023' }
      ];
    }
  }

  verificarAlertaEmergencia() {
    const alerta = localStorage.getItem('alertaEmergencia');
    if (alerta) {
      const data = JSON.parse(alerta);
      if (data.activa) {
        this.mostrarAlertaEmergencia(data.fecha);
        localStorage.removeItem('alertaEmergencia');
      }
    }
  }

  async mostrarAlertaEmergencia(fechaHora: string) {
    this.reproducirSonidoAlerta();

    const alert = await this.alertController.create({
      header: '🚨 ALERTA DE EMERGENCIA',
      message: `
        <div style="text-align: center; color: #d32f2f; font-weight: bold; font-size: 1.1em;">
          ¡EVACUACIÓN INMEDIATA!
        </div>
        <br>
        <strong>Fecha y hora:</strong> ${fechaHora}<br><br>
        Diríjase a las <strong>salidas de emergencia más cercanas</strong>.<br>
        Siga las rutas señalizadas en el mapa.
      `,
      backdropDismiss: false,
      buttons: [
        {
          text: 'Cerrar',
          handler: () => {
            this.router.navigate(['/inicio']);
          }
        }
      ]
    });

    await alert.present();
  }

  reproducirSonidoAlerta() {
    try {
      const AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;

      const audioCtx = new AudioContext();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.type = 'square';
      oscillator.frequency.value = 750;
      gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.2);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 1.2);
    } catch (e) {
      console.warn('No se pudo reproducir el sonido de alerta:', e);
    }
  }

  mostrarDetalleAlerta(alerta: any) {
    this.alertaSeleccionada = alerta;
  }

  cerrarDetalle() {
    this.alertaSeleccionada = null;
  }

  cerrarSesion() {
    this.router.navigate(['/login']);
  }

  irInicio() {
    this.router.navigate(['/inicio']);
  }

  toggleInfo() {
    this.isInfoExpanded = !this.isInfoExpanded;
  }
}