export interface IAccesoUsuario {
  Usuario?: string;
  clave?: string;
}

export interface IUsuarioModel {
  ApeNom?: string;
  Correo?: string;
  FlagActivo?: boolean;
  FlagPermiso?: boolean;
  FlagRestablecer?: boolean;
  Foto?: string;
  Id_Perfil?: number;
  Perfil?: string;
  Usuario?: string;
}
