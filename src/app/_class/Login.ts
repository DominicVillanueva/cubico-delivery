import { IUsuarioModel } from '../_models/LoginModel';

export class Login {
  public static login: IUsuarioModel;

  public static setLogin(
    ApeNom: string,
    Correo: string,
    FlagActivo: boolean,
    FlagPermiso: boolean,
    FlagRestablecer: boolean,
    Foto: string,
    Id_Perfil: number,
    Perfil: string,
    Usuario: string
  ) {
    this.login = {
      ApeNom: ApeNom,
      Correo: Correo,
      FlagActivo: FlagActivo,
      FlagPermiso: FlagPermiso,
      FlagRestablecer: FlagRestablecer,
      Foto: Foto,
      Id_Perfil: Id_Perfil,
      Perfil: Perfil,
      Usuario: Usuario
    };
  }

  public static getLogin(): IUsuarioModel {
      return this.login;
  }

  public static removeLogin(): IUsuarioModel {
      localStorage.clear();
      this.login = null;
      return this.login;
  }
}
