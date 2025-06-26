export class Bankroll {
  constructor(id, nombre, bankInicial, moneda, ganancias, apuestas, roi, creadoEn) {
    this.id = id;                     // Firestore ID
    this.nombre = nombre;             // Nombre del bankroll
    this.bankInicial = bankInicial;   // Capital inicial en euros
    this.moneda = moneda;             // "€"
    this.ganancias = ganancias;       // Beneficio acumulado
    this.apuestas = apuestas;         // Nº total de apuestas
    this.roi = roi;                   // ROI (%)
    this.creadoEn = creadoEn;         // Timestamp
  }

  // Ejemplo de método útil
  calcularPorcentaje(importe) {
    return (importe / this.bankInicial) * 100;
  }

  calcularImporteDesdeStake(stake) {
    return (stake / 100) * this.bankInicial;
  }
}
