import { Parametros } from "./../utils/Parametros";
import { Observable } from "rxjs";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from "@angular/router";
import { Injectable } from "@angular/core";

@Injectable()
export class GuardiaInicio implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    return this.verificar_perfil();
  }

  private verificar_perfil(): boolean {
    if (!localStorage.getItem(Parametros.LS_DATOS_USUARIO)) {
      return true;
    }
    if (localStorage.getItem(Parametros.LS_DATOS_USUARIO)) {
      const usuario = JSON.parse(
        localStorage.getItem(Parametros.LS_DATOS_USUARIO)
      );
      if (usuario) {
        this.router.navigate([Parametros.RUTA_INICIO]);
        return false;
      }
    }
  }
}
