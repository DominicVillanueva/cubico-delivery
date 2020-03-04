import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IFiltroOperaciones } from "./../../_models/AdministrarUsuario";
import { Url } from "../../utils/Url";
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json"
  })
};

@Injectable({
  providedIn: "root"
})
export class UsersService {
  private OBTENER_EMBARQUES: string = Url.URL_CUBICO + "/CourierService.svc/rest/ListarEmbarquesXFecha";
  private OBTENER_ACTIVIDADES: string = Url.URL_CUBICO + "/CourierService.svc/rest/usp_ActividadesXFecha";
  private OBTENER_OPERACIONES: string = Url.URL_CUBICO + "/CourierService.svc/rest/usp_operaciones_usuario";

  constructor(private http: HttpClient) {}

  public obtener_embarques(fecha: string) {
    let ruta: string = `${this.OBTENER_EMBARQUES}?fecha=${fecha}`;
    const data = this.http.get(ruta, httpOptions).pipe(
      catchError(err => {
        return throwError("Error Servicio UsersService => ", err);
      })
    );
    return data;
  }

  public obtener_actividades(fecha: string) {
    let ruta: string = `${this.OBTENER_ACTIVIDADES}?fecha=${fecha}`;
    const data = this.http.get(ruta, httpOptions).pipe(
      catchError(err => {
        return throwError('Error servicio actividades => ', err);
      })
    );
    return data;
  }

  public obtener_operaciones(obtenerOperacion: IFiltroOperaciones) {
    let ruta: string = `${this.OBTENER_OPERACIONES}?intIdActividad=${obtenerOperacion.intIdActividad}&strUserRegistro=${obtenerOperacion.strUserRegistro}&dtFechaHoraRegistro=${obtenerOperacion.dtFechaHoraRegistro}`;
    const data = this.http.get(ruta, httpOptions).pipe(
      catchError(err => {
        return throwError("Error servicio operaciones => ", err);
      })
    );
    return data;
  }
}
