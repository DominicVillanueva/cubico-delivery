import { Login } from './../../_class/Login';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { IUsuarioModel } from 'src/app/_models/LoginModel';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  usuario: IUsuarioModel;
  @Output() public sidenavToggle = new EventEmitter();

  constructor() { }

  ngOnInit() {
    this.usuario = Login.getLogin();
  }

  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  }

  public onClick_cerrar_sesion() {
    Login.removeLogin();
  }

}
