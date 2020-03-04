import { Login } from "./../_class/Login";
import { Parametros } from "./../utils/Parametros";
import { Observable } from "rxjs";
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from "@angular/router";
import { Injectable } from "@angular/core";

@Injectable()
export class GuardiaSession implements CanActivate {
  constructor(private router: Router) {
    this.validar_session_activa();
  }
  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    return this.validar_sesion();
  }

  private validar_sesion(): boolean {
    if (this.validar_autenticacion()) {
      let usuario = JSON.parse(localStorage.getItem(Parametros.LS_DATOS_USUARIO));
      console.log("user ==>", usuario);
      if (usuario) {
        Login.setLogin(
          usuario.ApeNom,
          usuario.Correo,
          usuario.FlagActivo,
          usuario.FlagPermiso,
          usuario.FlagRestablecer,
          usuario.Foto,
          usuario.Id_Perfil,
          usuario.Perfil,
          usuario.Usuario
        );
        return true;
      }
    }
    this.router.navigate([Parametros.RUTA_LOGIN]);
    return false;
  }

  private validar_autenticacion(): boolean {
    let validarAutenticacion = localStorage.getItem(Parametros.LS_DATOS_USUARIO)
      ? true
      : false;
    return validarAutenticacion;
  }

  private validar_session_activa() {
    const temp = setInterval(() => {
      if (!this.validar_autenticacion()) {
        localStorage.clear();
        clearInterval(temp);
        this.router.navigate([Parametros.RUTA_LOGIN]);
      }
    }, 2000);
  }
}
