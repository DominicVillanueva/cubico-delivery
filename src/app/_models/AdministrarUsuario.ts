export interface IEmbarque {
  Id_Actividad?: number;
  Id_Tra?: string;
  strCodUser?: string;
  strNomUsuario?: string;
}

export interface IListarActividades {
  Apenom?: string;
  Confirmados?: number;
  Id_Tra?: string;
  Motivados?: number;
  Pendientes?: number;
  Porcentaje?: number;
  Recojos?: number;
  Total?: number;
  Usuario?: string;
}

export interface IFiltroOperaciones {
  intIdActividad?: number;
  strUserRegistro?: string;
  dtFechaHoraRegistro?: string;
}

export interface IResponseOperacion {
  Cx?: number;
  Cy?: number;
  dtFechaHoraRegistro: string;
  dtFinOperacion: string;
  dtInicioOperacion: string;
  intCodMotivo: number;
  intCode: string;
  srtRecipientName: string;
  strAddressRecipient: string;
  strBarcode: string;
  strCityRecipient: string;
  strDescripcionMotivo: string;
  strDocumentReceived: string;
  strReceivedBy: string;
  strSenderName: string;
  strTipoTransmision: string;
}
