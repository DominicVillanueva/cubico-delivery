import { Parametros } from "./../../utils/Parametros";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";

// @Services
import { AccesoService } from "./../../services/login-services/acceso.service";
import { IAccesoUsuario } from 'src/app/_models/LoginModel';

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  providers: [AccesoService]
})
export class LoginComponent implements OnInit {
  accederUsuario: IAccesoUsuario = {};
  constructor(
    private accesoService: AccesoService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  public onClick_ingresar() {
    if (this.accederUsuario.Usuario == null || this.accederUsuario.clave == null) {
      this._snackBar.open("¡Completar los campos!", "X", Parametros.SNACKBAR_OPTIONS);
      return;
    }

    if (this.accederUsuario.Usuario.match(' ')) {
      this._snackBar.open("¡No ingresar espacios!", "X", Parametros.SNACKBAR_OPTIONS);
      return;
    }

    this.accederUsuario = {
      Usuario: this.accederUsuario.Usuario,
      clave: this.accederUsuario.clave
    };

    this.login_usuario();
  }

  public login_usuario() {
    this.accesoService.login(this.accederUsuario).subscribe(
      data => {
        // TODO: ADD ALERT
        if (data == "") {
          this._snackBar.open('¡Acceso incorrecto, inténtalo nuevamente!','X', Parametros.SNACKBAR_OPTIONS);
          return;
        } else {
          this._snackBar.open(`¡Bienvenido, ${data[0].Perfil}! `,'X', Parametros.SNACKBAR_OPTIONS);
          localStorage.setItem(Parametros.LS_DATOS_USUARIO, JSON.stringify(data[0]));
          setTimeout(() => {
            this.router.navigate([Parametros.RUTA_INICIO]);
          }, 1000);
        }
      }, (err) => {
        this._snackBar.open('¡Acceso no disponible, intente luego!','X', Parametros.SNACKBAR_OPTIONS);
      }
    );
  }
}
