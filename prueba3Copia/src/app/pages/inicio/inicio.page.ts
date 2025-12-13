// src/app/pages/inicio/inicio.page.ts
import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class InicioPage implements OnInit {

  currentLocation = '';
  searchQuery = '';
  selectedDestination: string | null = null;
  routePoints: { x: number; y: number }[] = [];
  isRouteVisible = false;
  isRouteAnimated = false;
  navigationInstructions: string[] = [];

  filteredPlaces: { id: string; name: string }[] = [];
  filteredCurrentPlaces: { id: string; name: string }[] = [];

  pisoSeleccionado = 'piso1';

  allPlaces_piso3 = [
    { id: 'lc1', name: 'LC1' },
    { id: 'lc2', name: 'LC2' },
    { id: 'lc3', name: 'LC3' },
    { id: 'cetecom', name: 'CETECOM' },
    { id: 'lc4', name: 'LC4' },
    { id: 'lc5', name: 'LC5' },
    { id: 'internet', name: 'Internet' },
    { id: 'lc6', name: 'LC6' },
    { id: 'lc7', name: 'LC7' },
    { id: 'sala tecnologica', name: 'Sala Tecnológica' },
    { id: 'gimnasio', name: 'Gimnasio' },
    { id: 'direccion', name: 'Dirección' },
    { id: 'centro academico', name: 'Centro Académico' },
    { id: 'adm', name: 'ADM' },
    { id: 'sp1', name: 'SP1' },
    { id: 'sp2', name: 'SP2' },
    { id: 'sp3', name: 'SP3' },
    { id: 'sp4', name: 'SP4' },
    { id: 'citt', name: 'CITT' }
  ];

  allPlaces_piso2 = [
    { id: 'lc8', name: 'LC8' },
    { id: 'lc9', name: 'LC9' },
    { id: 'lc10', name: 'LC10' },
    { id: 'lc11', name: 'LC11' },
    { id: 'sala 205', name: 'SALA 205' },
    { id: 'sala 206', name: 'SALA 206' },
    { id: 'sala 207', name: 'SALA 207' },
    { id: 'sala 208', name: 'SALA 208' },
    { id: 'sala 209', name: 'SALA 209' },
    { id: 'cafeteria', name: 'CAFETERIA' },
    { id: 'auditorio', name: 'AUDITORIO' },
    { id: 'multicancha', name: 'MULTICANCHA' },
    { id: 'camarin alumnas', name: 'CAMARIN ALUMNAS' },
    { id: 'camarin alumnos', name: 'CAMARIN ALUMNOS' },
    { id: 'sala portafolio', name: 'SALA PORTAFOLIO' },
    { id: 'sp7', name: 'SP7' },
    { id: 'sp8', name: 'SP8' },
    { id: 'sp9', name: 'SP9' },
    { id: 'sp10', name: 'SP10' },
    { id: 'sp11', name: 'SP11' }
  ];

  allPlaces_piso1 = [
    { id: 'adm_hombres', name: 'ADM HOMBRES' },
    { id: 'adm_mujeres', name: 'ADM MUJERES' },
    { id: 'acceso_principal', name: 'ACCESO PRINCIPAL' },
    { id: 'baño_hombres', name: 'BAÑO HOMBRES' },
    { id: 'baño_mujeres', name: 'BAÑO MUJERES' },
    { id: 'biblioteca', name: 'BIBLIOTECA' },
    { id: 'caja', name: 'CAJA' },
    { id: 'capilla', name: 'CAPILLA' },
    { id: 'casino', name: 'CASINO' },
    { id: 'coordinacion_docente', name: 'COORDINACIÓN DOCENTE' },
    { id: 'punto_estudiantil', name: 'PUNTO ESTUDIANTIL' },
    { id: 'recepcion', name: 'RECEPCIÓN' },
    { id: 'sala_estudio', name: 'SALA DE ESTUDIO' },
    { id: 'sala_hibrida', name: 'SALA HÍBRIDA' }
  ];

  salaCoordinates_piso1: { [key: string]: { x: number; y: number } } = {
    'adm': { x: 45, y: 70 },
    'recepcion': { x: 100, y: 100 },
    'capilla': { x: 45, y: 150 },
    'sala_hibrida': { x: 45, y: 220 },
    'coordinacion_docente': { x: 45, y: 300 },
    'caja': { x: 45, y: 370 },
    'acceso_principal': { x: 158, y: 99 },
    'punto_estudiantil': { x: 280, y: 50 },
    'patio_central': { x: 200, y: 200 },
    'salas_estudio': { x: 280, y: 150 },
    'biblioteca': { x: 324, y: 206 },
    'casino': { x: 186, y: 407 }
  };

  salaCoordinates_piso3: { [key: string]: { x: number; y: number } } = {
    'lc1': { x: 93.0, y: 66.0 },
    'lc2': { x: 93.0, y: 104.0 },
    'lc3': { x: 93.0, y: 146.0 },
    'cetecom': { x: 93.0, y: 195.0 },
    'lc4': { x: 93.0, y: 246.0 },
    'lc5': { x: 93.0, y: 285.0 },
    'internet': { x: 93.0, y: 331.0 },
    'lc6': { x: 93.0, y: 366.0 },
    'lc7': { x: 93.0, y: 400.0 },
    'sala tecnologica': { x: 93.0, y: 446.0 },
    'gimnasio': { x: 325.0, y: 434.0 },
    'direccion': { x: 306.0, y: 83.0 },
    'centro academico': { x: 238.0, y: 87.0 },
    'adm': { x: 330.0, y: 125.0 },
    'sp1': { x: 330.0, y: 167.0 },
    'sp2': { x: 330.0, y: 206.0 },
    'sp3': { x: 330.0, y: 245.0 },
    'sp4': { x: 330.0, y: 283.0 },
    'citt': { x: 330.0, y: 339.0 }
  };

  salaCoordinates_piso2: { [key: string]: { x: number; y: number } } = {
    'lc8': { x: 93.0, y: 66.0 },
    'lc9': { x: 93.0, y: 104.0 },
    'lc10': { x: 93.0, y: 146.0 },
    'lc11': { x: 67, y: 262 },
    'sala 205': { x: 93.0, y: 230.0 },
    'sala 206': { x: 93.0, y: 272.0 },
    'sala 207': { x: 93.0, y: 314.0 },
    'sala 208': { x: 93.0, y: 356.0 },
    'sala 209': { x: 93.0, y: 398.0 },
    'cafeteria': { x: 93.0, y: 440.0 },
    'auditorio': { x: 325.0, y: 100.0 },
    'multicancha': { x: 325.0, y: 300.0 },
    'camarin alumnas': { x: 325.0, y: 420.0 },
    'camarin alumnos': { x: 325.0, y: 460.0 },
    'sala portafolio': { x: 303.0, y: 100.0 },
    'sp7': { x: 303.0, y: 142.0 },
    'sp8': { x: 303.0, y: 184.0 },
    'sp9': { x: 303.0, y: 226.0 },
    'sp10': { x: 303.0, y: 268.0 },
    'sp11': { x: 303.0, y: 310.0 }
  };

  salaPasilloCoordinates_piso3 = { ...this.salaCoordinates_piso3 };
  salaPasilloCoordinates_piso2 = { ...this.salaCoordinates_piso2 };
  salaPasilloCoordinates_piso1 = { ...this.salaCoordinates_piso1 };

  escalerasPiso3: { [key: string]: { x: number; y: number } } = {
    'escalera_1': { x: 120, y: 40 },
    'escalera_2': { x: 134, y: 334 },
    'escalera_3': { x: 123, y: 487 },
    'escalera_4': { x: 268, y: 101 },
    'escalera_5': { x: 340, y: 101 },
    'escalera_6': { x: 351, y: 410 }
  };

  escalerasPiso2: { [key: string]: { x: number; y: number } } = {
    'escalera_1': { x: 133, y: 40 },
    'escalera_2': { x: 124, y: 271 },
    'escalera_3': { x: 125, y: 328 },
    'escalera_4': { x: 123, y: 488 },
    'escalera_5': { x: 340, y: 101 },
    'escalera_6': { x: 360, y: 396 }
  };

  private salasIzquierda_piso3 = ['lc1', 'lc2', 'lc3', 'cetecom', 'lc4', 'lc5', 'internet', 'lc6', 'lc7', 'sala tecnologica'];
  private salasDerecha_piso3 = ['direccion', 'centro academico', 'adm', 'sp1', 'sp2', 'sp3', 'sp4', 'citt', 'gimnasio'];

  private salasIzquierda_piso2 = ['lc8', 'lc9', 'lc10', 'lc11', 'sala 205', 'sala 206', 'sala 207', 'sala 208', 'sala 209', 'cafeteria'];
  private salasDerecha_piso2 = ['auditorio', 'multicancha', 'camarin alumnas', 'camarin alumnos', 'sala portafolio', 'sp7', 'sp8', 'sp9', 'sp10', 'sp11'];

  @ViewChild('routePath', { static: false }) routePathRef!: ElementRef<SVGPolylineElement>;

  constructor(
    private router: Router,
    private firebaseSvc: FirebaseService,
    private alertController: AlertController
  ) {
    const allPlaces = [...this.allPlaces_piso1, ...this.allPlaces_piso2, ...this.allPlaces_piso3];
    this.filteredPlaces = [...allPlaces];
    this.filteredCurrentPlaces = [...allPlaces];
  }

  ngOnInit() {
    // Inicialización inicial (sin verificar alerta aquí)
  }

  // ✅ MÉTODO DE CICLO DE VIDA DE IONIC: se ejecuta cada vez que la página se muestra
  ionViewDidEnter() {
    this.verificarAlertaEmergencia();
  }

  // === ALERTA EMERGENCIA ===
  async verificarAlertaEmergencia() {
    const alerta = localStorage.getItem('alertaEmergencia');
    if (alerta) {
      const data = JSON.parse(alerta);
      if (data.activa) {
        await this.mostrarAlertaEmergencia(data.fecha);
        localStorage.removeItem('alertaEmergencia');
      }
    }
  }

  async mostrarAlertaEmergencia(fechaHora: string) {
  this.reproducirSonidoAlerta();

  const alert = await this.alertController.create({
    header: '🚨 ALERTA DE SIMULACRO',
    message: `¡EVACUACIÓN INMEDIATA!\n\nFecha y hora: ${fechaHora}\n\nDiríjase a las salidas de emergencia más cercanas.`,
    backdropDismiss: false,
    buttons: [
      {
        text: 'Cerrar',
        handler: () => {}
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
  // === FIN ALERTA ===

  getMapImage(): string {
    if (this.pisoSeleccionado === 'piso3') return 'assets/CETRO ACADEMICO.png';
    if (this.pisoSeleccionado === 'piso1') return 'assets/CETRO ACADEMICO_PISO1.png';
    return 'assets/CETRO ACADEMICO_PISO2.png';
  }

  getSalaCoordinates() {
    if (this.pisoSeleccionado === 'piso3') return this.salaCoordinates_piso3;
    if (this.pisoSeleccionado === 'piso1') return this.salaCoordinates_piso1;
    return this.salaCoordinates_piso2;
  }

  getRoutePath(points: { x: number; y: number }[]): string {
    return points.map(p => `${p.x},${p.y}`).join(' ');
  }

  cambiarPiso() {
    const allPlaces = [...this.allPlaces_piso1, ...this.allPlaces_piso2, ...this.allPlaces_piso3];
    this.filteredPlaces = [...allPlaces];
    this.filteredCurrentPlaces = [...allPlaces];
  }

  onCurrentLocationInput(event: any) {
    const query = (event.target?.value || '').toLowerCase().trim();
    this.currentLocation = query;
    const allPlaces = [...this.allPlaces_piso1, ...this.allPlaces_piso2, ...this.allPlaces_piso3];
    this.filteredCurrentPlaces = query ? allPlaces.filter(p => p.name.toLowerCase().includes(query)) : [...allPlaces];
    this.updateRoute();
  }

  onSearchInput(event: any) {
    const query = (event.target?.value || '').toLowerCase().trim();
    this.searchQuery = query;
    const allPlaces = [...this.allPlaces_piso1, ...this.allPlaces_piso2, ...this.allPlaces_piso3];
    this.filteredPlaces = query ? allPlaces.filter(p => p.name.toLowerCase().includes(query)) : [...allPlaces];
    this.updateRoute();
  }

  selectCurrentLocation(place: { name: string }) {
    this.currentLocation = place.name;
    this.filteredCurrentPlaces = [];
    this.updateRoute();
  }

  selectDestination(place: { name: string }) {
    this.selectedDestination = place.name;
    this.searchQuery = place.name;
    this.filteredPlaces = [];
    
    if (this.currentLocation) {
      this.firebaseSvc.registrarRutaGenerada(this.currentLocation, place.name);
    }
    
    this.updateRoute();
  }

  private getIdFromName(name: string): string | null {
    const places = [...this.allPlaces_piso1, ...this.allPlaces_piso2, ...this.allPlaces_piso3];
    const found = places.find(p => p.name === name);
    return found ? found.id : null;
  }

  updateRoute() {
    this.isRouteVisible = false;
    this.isRouteAnimated = false;
    this.navigationInstructions = [];
    this.routePoints = [];

    if (!this.currentLocation || !this.selectedDestination) return;

    const start = this.currentLocation.toLowerCase();
    const end = this.selectedDestination.toLowerCase();

    const startPiso = this.allPlaces_piso3.some(p => p.id === start) ? 'piso3' :
                     this.allPlaces_piso2.some(p => p.id === start) ? 'piso2' : 'piso1';
    const endPiso = this.allPlaces_piso3.some(p => p.id === end) ? 'piso3' :
                   this.allPlaces_piso2.some(p => p.id === end) ? 'piso2' : 'piso1';

    if (startPiso === endPiso) {
      this.superUpdateRouteMismoPiso(start, end, startPiso);
    }
    else if ((startPiso === 'piso3' && endPiso === 'piso2') || (startPiso === 'piso2' && endPiso === 'piso3')) {
      this.calcularRutaEntrePisos(start, end, startPiso, endPiso);
    }
    else {
      const startCoord = startPiso === 'piso3' ? this.salaCoordinates_piso3[start] :
                        startPiso === 'piso2' ? this.salaCoordinates_piso2[start] : this.salaCoordinates_piso1[start];
      const endCoord = endPiso === 'piso3' ? this.salaCoordinates_piso3[end] :
                      endPiso === 'piso2' ? this.salaCoordinates_piso2[end] : this.salaCoordinates_piso1[end];
      if (startCoord && endCoord) {
        this.routePoints = [startCoord, endCoord];
        this.navigationInstructions = [
          `Estás en ${this.getPlaceDisplayName(start)}.`,
          `Ve a ${this.getPlaceDisplayName(end)}.`,
          `¡Has llegado!`
        ];
      }
    }

    if (startPiso === endPiso) {
      this.isRouteVisible = true;
      setTimeout(() => {
        this.isRouteAnimated = false;
        setTimeout(() => {
          this.isRouteAnimated = true;
        }, 10);
      }, 50);
    }
  }

  superUpdateRouteMismoPiso(start: string, end: string, piso: string) {
    const coords = piso === 'piso3' ? this.salaPasilloCoordinates_piso3 :
                   piso === 'piso2' ? this.salaPasilloCoordinates_piso2 :
                   this.salaPasilloCoordinates_piso1;

    const startCoord = coords[start];
    const endCoord = coords[end];
    if (!startCoord || !endCoord) return;

    if (piso === 'piso1' && start === 'acceso_principal' && end === 'casino') {
      this.routePoints = [
        { x: 157, y: 96 },
        { x: 99, y: 143 },
        { x: 99, y: 382 },
        { x: 267, y: 376 },
        { x: 186, y: 407 }
      ];
      this.navigationInstructions = [
        `Estás en Acceso Principal.`,
        `Camina al pasillo izquierdo.`,
        `Baja hasta el cruce inferior.`,
        `Gira a la derecha y avanza por el pasillo inferior.`,
        `Llegas al Casino.`,
        `¡Has llegado!`
      ];
    }
    else {
      if (piso === 'piso3' || piso === 'piso2') {
        const salasIzquierda = piso === 'piso3' ? 
          this.salasIzquierda_piso3 : 
          this.salasIzquierda_piso2;
        const salasDerecha = piso === 'piso3' ? 
          this.salasDerecha_piso3 : 
          this.salasDerecha_piso2;

        const startIzq = salasIzquierda.includes(start);
        const endIzq = salasIzquierda.includes(end);
        const startDer = salasDerecha.includes(start);
        const endDer = salasDerecha.includes(end);

        if ((startIzq && endIzq) || (startDer && endDer)) {
          this.routePoints = [startCoord, endCoord];
          this.navigationInstructions = [
            `Estás en ${this.getPlaceDisplayName(start)}.`,
            `Camina directamente hacia ${this.getPlaceDisplayName(end)}.`,
            `¡Has llegado!`
          ];
        } else if (startIzq && endDer) {
          this.routePoints = [startCoord, { x: 111, y: 140 }, { x: 307, y: 141 }, { x: 307, y: endCoord.y }, endCoord];
          this.navigationInstructions = [
            `Estás en ${this.getPlaceDisplayName(start)}.`,
            `Avanza por el pasillo izquierdo hasta el cruce central.`,
            `Gira a la derecha.`,
            `Sigue recto hasta la altura de ${this.getPlaceDisplayName(end)}.`,
            `¡Has llegado!`
          ];
        } else if (startDer && endIzq) {
          this.routePoints = [startCoord, { x: 307, y: 141 }, { x: 111, y: 140 }, { x: 111, y: endCoord.y }, endCoord];
          this.navigationInstructions = [
            `Estás en ${this.getPlaceDisplayName(start)}.`,
            `Camina por el pasillo derecho hasta el cruce central.`,
            `Gira a la izquierda.`,
            `Continúa recto hasta la altura de ${this.getPlaceDisplayName(end)}.`,
            `¡Has llegado!`
          ];
        } else {
          this.routePoints = [startCoord, endCoord];
          this.navigationInstructions = [`Ve desde ${this.getPlaceDisplayName(start)} hasta ${this.getPlaceDisplayName(end)}.`];
        }
      }
      else {
        this.routePoints = [startCoord, endCoord];
        this.navigationInstructions = [
          `Estás en ${this.getPlaceDisplayName(start)}.`,
          `Camina hacia ${this.getPlaceDisplayName(end)}.`,
          `¡Has llegado!`
        ];
      }
    }
  }

  calcularRutaEntrePisos(start: string, end: string, startPiso: string, endPiso: string) {
    let mejorEscalera = 'escalera_1';
    let menorDistancia = Infinity;

    const endCoords = endPiso === 'piso3' ? this.salaCoordinates_piso3[end] : this.salaCoordinates_piso2[end];
    if (!endCoords) return;

    for (const key of Object.keys(endPiso === 'piso3' ? this.escalerasPiso3 : this.escalerasPiso2)) {
      const escCoords = endPiso === 'piso3' ? this.escalerasPiso3[key] : this.escalerasPiso2[key];
      const distancia = Math.sqrt(Math.pow(escCoords.x - endCoords.x, 2) + Math.pow(escCoords.y - endCoords.y, 2));
      if (distancia < menorDistancia) {
        menorDistancia = distancia;
        mejorEscalera = key;
      }
    }

    const startCoord = startPiso === 'piso3' ? this.salaCoordinates_piso3[start] : this.salaCoordinates_piso2[start];
    const endCoord = endPiso === 'piso3' ? this.salaCoordinates_piso3[end] : this.salaCoordinates_piso2[end];
    const escOrigen = startPiso === 'piso3' ? this.escalerasPiso3[mejorEscalera] : this.escalerasPiso2[mejorEscalera];
    const escDestino = endPiso === 'piso3' ? this.escalerasPiso3[mejorEscalera] : this.escalerasPiso2[mejorEscalera];

    if (!startCoord || !endCoord || !escOrigen || !escDestino) return;

    this.routePoints = [startCoord, escOrigen];
    this.isRouteVisible = true;
    this.isRouteAnimated = true;

    const accion = startPiso === 'piso3' ? 'Baja' : 'Sube';
    this.navigationInstructions = [
      `Estás en ${this.getPlaceDisplayName(start)} (${startPiso}).`,
      `${accion} por la escalera más cercana.`,
      `Cambiando al ${endPiso}...`
    ];

    this.filteredPlaces = [];
    this.filteredCurrentPlaces = [];

    setTimeout(() => {
      this.pisoSeleccionado = endPiso;
      setTimeout(() => {
        this.routePoints = [escDestino, endCoord];
        this.isRouteVisible = true;
        this.isRouteAnimated = false;

        this.navigationInstructions = [
          `Ahora estás en ${endPiso}.`,
          `Camina hacia ${this.getPlaceDisplayName(end)}.`,
          `¡Has llegado!`
        ];

        setTimeout(() => {
          this.isRouteAnimated = true;
        }, 50);
      }, 100);
    }, 1500);
  }

  getPlaceDisplayName(id: string): string {
    const places = [...this.allPlaces_piso1, ...this.allPlaces_piso2, ...this.allPlaces_piso3];
    const place = places.find(p => p.id === id);
    return place ? place.name : id.toUpperCase();
  }

  cerrarSesion() {
    localStorage.removeItem('currentUserEmail');
    this.router.navigate(['/login']);
  }

  irAlertas() {
    this.router.navigate(['/alertas']);
  }

  hablarInstrucciones(instrucciones: string[]) {
    if (instrucciones.length > 0 && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(instrucciones.join('. '));
      utterance.lang = 'es-ES';
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
    }
  }
}