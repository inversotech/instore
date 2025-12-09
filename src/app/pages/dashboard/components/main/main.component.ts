import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'open-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  public ventasDia = {
    valor: 12450,
    moneda: 'S/',
    percent_vs_anterior: '+12.5%',
    percent_vs_anterior_status: 'success',
  };
  public ventasMes = {
    valor: 345280,
    moneda: 'S/',
    percent_vs_anterior: '-32.5%',
    percent_vs_anterior_status: 'danger',
  };
  // public ordenesPendientes = 23;
  public ordenesPendientes = {
    valor: 23,
    por_vencer_hoy: 3,
  };
  public clientesActivos = 156;

  public productosTopVentas = [
    { nombre: 'Laptop HP', sku: 'LPT-001', cantidad: '145' },
    { nombre: 'Mouse Logitech', sku: 'MOU-002', cantidad: '98' },
    { nombre: 'Teclado Mecánico', sku: 'KEY-003', cantidad: '87' },
    { nombre: 'Monitor Samsung', sku: 'MON-004', cantidad: '65' },
    { nombre: 'Webcam HD', sku: 'WEB-005', cantidad: '54' }
  ];

  public ultimasVentas = [
    { numero: '#VNT-001234', cliente: 'Juan Pérez García', fecha: new Date(), total: 1250, estado: 'Pagado' },
    { numero: '#VNT-001233', cliente: 'María López Sánchez', fecha: new Date(), total: 850, estado: 'Pagado' },
    { numero: '#VNT-001232', cliente: 'Carlos Rodríguez', fecha: new Date(), total: 2100, estado: 'Pendiente' },
    { numero: '#VNT-001231', cliente: 'Ana Torres Méndez', fecha: new Date(), total: 450, estado: 'Pagado' },
    { numero: '#VNT-001230', cliente: 'Pedro Gómez Luna', fecha: new Date(), total: 3200, estado: 'Pagado' }
  ];
  constructor(
    private httpClient: HttpClient,
  ) {
  }

  ngOnInit() {
  }

}
