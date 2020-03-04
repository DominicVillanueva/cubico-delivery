import {
  IEmbarque,
  IListarActividades,
  IFiltroOperaciones,
  IResponseOperacion
} from "./../../_models/AdministrarUsuario";
import { UsersService } from "./../../services/users-services/users.service";
import { Component, OnInit, ViewChild } from "@angular/core";
import {
  trigger,
  state,
  style,
  transition,
  animate
} from "@angular/animations";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import {
  MatSelectionList,
  MatSelectionListChange
} from "@angular/material/list";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      )
    ])
  ]
})
export class DashboardComponent implements OnInit {
  dataSource: any;
  columnsToDisplay = [
    "Id_Tra",
    "Usuario",
    "Apenom",
    "Pendientes",
    "Confirmados",
    "Motivados",
    "Total",
    "Porcentaje"
  ];

  // VARIABLES PARA GOOGLE MAPS
  texto: string = "Geolocalización";
  lat: number = -12.046373;
  lng: number = -77.042755;
  zoom: number = 8;

  listarActividades: IListarActividades[] = [];
  listarEmbarques: IEmbarque[] = [];
  filtrarOperacion: IFiltroOperaciones = {};
  listarOperaciones: IResponseOperacion[] = [];
  fechaSeleccionada: string;
  colorMarker: string;
  listColorsMarkes: string[] = ["yellow", "brown", "green", "blue", "red"];

  listarLeyendas = [
    {
      name: "Entregado",
      color: "#34a853"
    },
    {
      name: "Motivado",
      color: "#FF7668"
    },
    {
      name: "Inicio de Actividad",
      color: "#FFFF6E"
    },
    {
      name: "Fin de Actividad",
      color: "#6991FD"
    },
    {
      name: "Recorrido",
      color: "#FF0000"
    }
  ];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSelectionList) users: MatSelectionList;

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public onClick_filtrar_usuarios(event: MatDatepickerInputEvent<Date>) {
    // Limipiar data.
    this.listarEmbarques = [];
    this.listarActividades = [];
    this.dataSource = [];

    let formatoFecha = new Date(event.value).toISOString().slice(0, 10);
    this.usersService
      .obtener_embarques(formatoFecha)
      .subscribe((data: any[]) => {
        data.length == 0
          ? (this.listarEmbarques = [])
          : (this.listarEmbarques = this.listarEmbarques.concat(data));
      });

    this.selectedOnlyOne();
    this.obtener_actividades_x_fecha(formatoFecha);
  }

  public obtener_actividades_x_fecha(fecha) {
    this.usersService.obtener_actividades(fecha).subscribe((data: any[]) => {
      if (data.length > 0) {
        this.listarActividades = this.listarActividades.concat(data);
        this.dataSource = new MatTableDataSource(this.listarActividades);
        this.dataSource.paginator = this.paginator;
      } else {
        this.listarActividades = [];
      }
    });
  }

  public selectedOnlyOne() {
    if (this.users != undefined) {
      this.users.selectionChange.subscribe((u: MatSelectionListChange) => {
        this.users.deselectAll();
        u.option.selected = true;
      });
    } else {
      return;
    }
  }

  public onClick_obtener_operacion(event) {
    let url = "http://maps.google.com/mapfiles/ms/icons/";
    let formatoFecha = new Date(this.fechaSeleccionada)
      .toISOString()
      .slice(0, 10);
    this.filtrarOperacion = {
      intIdActividad: event.option.value.Id_Actividad,
      strUserRegistro: event.option.value.strCodUser,
      dtFechaHoraRegistro: formatoFecha
    };
    this.usersService
      .obtener_operaciones(this.filtrarOperacion)
      .subscribe((data: any[]) => {
        this.listarOperaciones = [];
        data.length == 0
          ? (this.listarOperaciones = [])
          : (this.listarOperaciones = this.listarOperaciones.concat(data));

        this.listarOperaciones.forEach(el => {
          // Validación para los colores del markers
          if (el.dtInicioOperacion != "") {
            url += this.listColorsMarkes[0] + "-dot.png";
          } else if (el.dtFinOperacion != "") {
            url += this.listColorsMarkes[3] + "-dot.png";
          } else if (el.intCodMotivo == 5) {
            url += this.listColorsMarkes[2] + "-dot.png";
          } else if (el.intCodMotivo == 22) {
            url += this.listColorsMarkes[1] + "-dot.png";
          } else {
            url += this.listColorsMarkes[4] + "-dot.png";
          }

          this.lat = el.Cx;
          this.lng = el.Cy;
          this.colorMarker = url;
          this.zoom = 14;
        });
      });
  }

  // Calcular los datos de la tabla.
  public getTotalPendientes() {
    return this.listarActividades
      .map(x => x.Pendientes)
      .reduce((a, b) => a + b, 0);
  }
  public getTotalConfirmados() {
    return this.listarActividades
      .map(x => x.Confirmados)
      .reduce((a, b) => a + b, 0);
  }
  public getTotalMotivados() {
    return this.listarActividades
      .map(x => x.Motivados)
      .reduce((a, b) => a + b, 0);
  }
  public getTotal() {
    return this.listarActividades.map(x => x.Total).reduce((a, b) => a + b, 0);
  }
}
