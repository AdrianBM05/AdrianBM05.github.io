export class Apuesta {
  constructor({
    idBankroll,
    fecha,
    evento,
    cuota,
    tipoEntrada,
    importe,
    unidades,
    resultado,
    beneficio,
    deporte,
    competicion = null,
    tipster = null
  }) {
    this.idBankroll = idBankroll;
    this.fecha = fecha;
    this.evento = evento;
    this.cuota = cuota;
    this.tipoEntrada = tipoEntrada; // "€" o "u"
    this.importe = importe;         // puede ser null
    this.unidades = unidades;       // puede ser null
    this.resultado = resultado;     // "ganada", "perdida", "pendiente"
    this.beneficio = beneficio;
    this.deporte = deporte;
    this.competicion = competicion;
    this.tipster = tipster;
  }

  calcularBeneficio() {
    if (this.resultado === "ganada") {
      return parseFloat(((this.importe || 0) * (this.cuota - 1)).toFixed(2));
    } else if (this.resultado === "perdida") {
      return -(this.importe || 0);
    } else {
      return 0;
    }
  }
}


