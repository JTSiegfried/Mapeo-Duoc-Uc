// src/app/services/firebase.service.ts
import { Injectable } from '@angular/core';
import { getDatabase, ref, get, set } from 'firebase/database';
import { getApps, initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyDIeBf2UU5yBYGoQO8FOrRvrVk0lgnzrw8",
  authDomain: "duoc-mapa-app.firebaseapp.com",
  databaseURL: "https://duoc-mapa-app-default-rtdb.firebaseio.com",
  projectId: "duoc-mapa-app",
  storageBucket: "duoc-mapa-app.firebasestorage.app",
  messagingSenderId: "635027118550",
  appId: "1:635027118550:web:6758f094ec0bc6ad6cec77"
};

if (getApps().length === 0) {
  initializeApp(firebaseConfig);
}

export const db = getDatabase();

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  async incrementarContadorSala(salaId: string): Promise<void> {
    const cleanId = salaId.trim().toLowerCase();
    const salaRef = ref(db, 'salas/' + cleanId);
    const snapshot = await get(salaRef);
    const count = snapshot.exists() ? snapshot.val().count || 0 : 0;
    await set(salaRef, { id: cleanId, count: count + 1 });
  }

  async incrementarContadorOrigen(origenId: string): Promise<void> {
    const cleanId = origenId.trim().toLowerCase();
    const origenRef = ref(db, 'origenes/' + cleanId);
    const snapshot = await get(origenRef);
    const count = snapshot.exists() ? snapshot.val().count || 0 : 0;
    await set(origenRef, { id: cleanId, count: count + 1 });
  }

  private obtenerDiaSemana(): string | null {
    const dias = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
    const hoy = new Date();
    const diaIndex = hoy.getDay();
    const diaNombre = dias[diaIndex];
    return diaNombre === 'domingo' ? null : diaNombre;
  }

  async incrementarRutasPorDia(): Promise<void> {
    const dia = this.obtenerDiaSemana();
    if (!dia) return;
    const diaRef = ref(db, `kpi/rutasPorDia/${dia}`);
    const snapshot = await get(diaRef);
    const current = snapshot.exists() ? snapshot.val() : 0;
    await set(diaRef, current + 1);
  }

  async incrementarRutasPorHora(): Promise<void> {
    const hora = new Date().getHours();
    const horaRef = ref(db, `kpi/rutasPorHora/hora_${hora}`);
    const snapshot = await get(horaRef);
    const current = snapshot.exists() ? snapshot.val() : 0;
    await set(horaRef, current + 1);
  }

  async registrarRutaGenerada(origen: string, destino: string): Promise<void> {
    await this.incrementarContadorOrigen(origen);
    await this.incrementarContadorSala(destino);
    await this.incrementarRutasPorDia();
    await this.incrementarRutasPorHora();
    console.log('✅ Ruta registrada:', origen, '→', destino);
  }
}