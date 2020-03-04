import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders
} from "@angular/common/http";

import { Url } from "../../utils/Url";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { IAccesoUsuario } from 'src/app/_models/LoginModel';

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json"
  })
};

@Injectable({
  providedIn: "root"
})
export class AccesoService {
  private ACCEDERDATOUSUARIO = Url.URL_CUBICO + "/UsuarioService.svc/rest/ValidarUsuarioCourier";

  constructor(private http: HttpClient) {}

  public login(usuario: IAccesoUsuario) {
    let ruta: string =`${this.ACCEDERDATOUSUARIO}?Usuario=${usuario.Usuario}&clave=${usuario.clave}`;
    const data = this.http.get(ruta, httpOptions).pipe(
      catchError(err => {
        return throwError("error servicio login => ", err);
      })
    );
    return data;
  }
}
