import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { IFiltroOperaciones, IFiltroActividadUsuario, IFiltroEmbarque } from "./../../_models/AdministrarUsuario";
import { Url } from "../../utils/Url";
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
  }),
};

let URL_COURIER = '/Courierservice.svc/rest/';

@Injectable({
  providedIn: "root",
})
export class CourierService {
  private OBTENER_EMBARQUES: string = Url.URL_CUBICO + URL_COURIER + 'ListarEmbarquesXFecha';
  private OBTENER_ACTIVIDADES: string = Url.URL_CUBICO + URL_COURIER + 'usp_ActividadesXFecha';
  private OBTENER_OPERACIONES: string = Url.URL_CUBICO + URL_COURIER + 'usp_operaciones_usuario';
  private OBTENER_ACTVIDAD_USUARIO: string = Url.URL_CUBICO + URL_COURIER + 'usp_Actividad_User';
  private OBTENER_IMAGENES_X_EMBARQUE: string = Url.URL_CUBICO + URL_COURIER + 'SGAA_SP_ListarImagenesxEmbarque';
  private OBTENER_BULTOS_X_EMBARQUE: string = Url.URL_CUBICO + URL_COURIER + 'SGAA_SP_S_ListarBultoxEmbarqueActividad';

  constructor(private http: HttpClient) {}

  public obtener_embarques(fecha: string) {
    let ruta: string = `${this.OBTENER_EMBARQUES}?fecha=${fecha}`;
    const data = this.http.get(ruta, httpOptions).pipe(
      catchError((err) => {
        return throwError("Error Servicio UsersService => ", err);
      })
    );
    return data;
  }

  public obtener_actividades(fecha: string) {
    let ruta: string = `${this.OBTENER_ACTIVIDADES}?fecha=${fecha}`;
    const data = this.http.get(ruta, httpOptions).pipe(
      catchError((err) => {
        return throwError("Error servicio actividades => ", err);
      })
    );
    return data;
  }

  public obtener_operaciones(obtenerOperacion: IFiltroOperaciones) {
    let ruta: string = `${this.OBTENER_OPERACIONES}?intIdActividad=${obtenerOperacion.intIdActividad}&strUserRegistro=${obtenerOperacion.strUserRegistro}&dtFechaHoraRegistro=${obtenerOperacion.dtFechaHoraRegistro}`;
    const data = this.http.get(ruta, httpOptions).pipe(
      catchError((err) => {
        return throwError("Error servicio operaciones => ", err);
      })
    );
    return data;
  }

  public obtener_actividades_usuario(obtenerOperacion: IFiltroActividadUsuario) {
    let ruta: string = `${this.OBTENER_ACTVIDAD_USUARIO}?intIdActividad=${obtenerOperacion.intIdActividad}&strUser=${obtenerOperacion.strUser}&dtFecha=${obtenerOperacion.dtFecha}`;
    const data = this.http.get(ruta, httpOptions).pipe(
      catchError((err) => {
        return throwError("Error servicio actividades_usuario => ", err);
      })
    );
    return data;
  }

  public obtener_imagenes_x_embarque(obtenerImage: IFiltroEmbarque) {
    let ruta: string = `${this.OBTENER_IMAGENES_X_EMBARQUE}?id_tra=${obtenerImage.id_tra}&id_tx=${obtenerImage.id_tx}`;
    const data = this.http.get(ruta, httpOptions).pipe(
      catchError((err) => {
        return throwError("Error servicio obtener_imagenes_x_embarque => ", err);
      })
    );
    return data;
  }

  public obtener_bultos_x_embarque(obtenerBultos: IFiltroEmbarque) {
    let ruta: string = `${this.OBTENER_BULTOS_X_EMBARQUE}?id_tra=${obtenerBultos.id_tra}&id_tx=${obtenerBultos.id_tx}`;
    const data = this.http.get(ruta, httpOptions).pipe(
      catchError((err) => {
        return throwError("Error servicio obtener_bultos_x_embarque => ", err);
      })
    );
    return data;
  }
}
