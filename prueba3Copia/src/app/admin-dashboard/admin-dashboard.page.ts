// src/app/admin-dashboard/admin-dashboard.page.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
  IonButton,
  IonIcon
} from '@ionic/angular/standalone';
import { NgApexchartsModule } from 'ng-apexcharts';
import { get, ref } from 'firebase/database';
import { db } from '../services/firebase.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.page.html',
  styleUrls: ['./admin-dashboard.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonList,
    IonItem,
    IonLabel,
    IonBadge,
    IonButton,
    IonIcon,
    NgApexchartsModule
  ]
})
export class AdminDashboardPage implements OnInit {
  diasData: number[] = [];
  diasLabels: string[] = [];
  horasData: number[] = [];
  horasLabels: string[] = [];
  origenes: { id: string; count: number }[] = [];
  destinos: { id: string; count: number }[] = [];

  // Para gráfico de salas
  salaMasBuscadasLabels: string[] = [];
  salaMasBuscadasData: number[] = [];

  // ✅ NUEVO: Para gráfico de orígenes
  origenesLabels: string[] = [];
  origenesData: number[] = [];

  datosCargados = false;

  constructor(private router: Router) {}

  async ngOnInit() {
    await this.cargarDatos();
  }

  async cargarDatos() {
    try {
      const rutasDiaRef = ref(db, 'kpi/rutasPorDia');
      const rutasDiaSnap = await get(rutasDiaRef);
      const diasOrden = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
      this.diasLabels = diasOrden.map(d => d.charAt(0).toUpperCase() + d.slice(1));
      this.diasData = diasOrden.map(dia => 
        rutasDiaSnap.exists() ? (rutasDiaSnap.val()[dia] || 0) : 0
      );

      const rutasHoraRef = ref(db, 'kpi/rutasPorHora');
      const rutasHoraSnap = await get(rutasHoraRef);
      this.horasData = [];
      this.horasLabels = [];
      
      if (rutasHoraSnap.exists()) {
        const data = rutasHoraSnap.val();
        for (let h = 8; h <= 22; h++) {
          this.horasData.push(data[`hora_${h}`] || 0);
          this.horasLabels.push(
            h === 12 ? "12 PM" : 
            h > 12 ? `${h - 12} PM` : 
            `${h} AM`
          );
        }
      } else {
        for (let h = 8; h <= 22; h++) {
          this.horasData.push(0);
          this.horasLabels.push(
            h === 12 ? "12 PM" : 
            h > 12 ? `${h - 12} PM` : 
            `${h} AM`
          );
        }
      }

      const origenesRef = ref(db, 'origenes');
      const origenesSnap = await get(origenesRef);
      this.origenes = [];
      if (origenesSnap.exists()) {
        const data = origenesSnap.val();
        this.origenes = Object.values(data)
          .map((item: any) => ({ id: item.id || 'desconocido', count: item.count || 0 }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);
      }

      const destinosRef = ref(db, 'salas');
      const destinosSnap = await get(destinosRef);
      this.destinos = [];
      if (destinosSnap.exists()) {
        const data = destinosSnap.val();
        this.destinos = Object.values(data)
          .map((item: any) => ({ id: item.id || 'desconocido', count: item.count || 0 }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);
      }

      // Preparar datos para el gráfico de salas
      this.salaMasBuscadasLabels = this.destinos.map(d => d.id);
      this.salaMasBuscadasData = this.destinos.map(d => d.count);

      // ✅ NUEVO: Preparar datos para el gráfico de orígenes
      this.origenesLabels = this.origenes.map(o => o.id);
      this.origenesData = this.origenes.map(o => o.count);

      this.datosCargados = true;
    } catch (error) {
      console.error('Error al cargar datos:', error);
      this.datosCargados = true;
    }
  }

  lanzarAlertaEmergencia() {
    const now = new Date();
    const fechaHora = now.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    localStorage.setItem('alertaEmergencia', JSON.stringify({
      activa: true,
      fecha: fechaHora
    }));

    const historial = JSON.parse(localStorage.getItem('historialAlertas') || '[]');
    historial.unshift({ titulo: 'Simulacro', fecha: fechaHora });
    localStorage.setItem('historialAlertas', JSON.stringify(historial));

    this.router.navigate(['/inicio'], { replaceUrl: true });
  }

  volver() {
    localStorage.removeItem('currentUserEmail');
    this.router.navigate(['/login']);
  }
}