import { Url } from "../../utils/Url";
import {
  IEmbarque,
  IListarActividades,
  IFiltroOperaciones,
  IResponseOperacion,
  IResponseActividadUsuario,
  IFiltroActividadUsuario,
} from "./../../_models/AdministrarUsuario";
import { UsersService } from "./../../services/users-services/users.service";
import { Component, OnInit, ViewChild } from "@angular/core";
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from "@angular/animations";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import {
  MatSelectionList,
  MatSelectionListChange,
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
      ),
    ]),
  ],
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
    "Porcentaje",
  ];

  // VARIABLES PARA GOOGLE MAPS
  texto: string = "Geolocalización";
  lat: number = -12.046373;
  lng: number = -77.042755;
  zoom: number = 8;

  // Optiones menu
  openInfo: boolean = false;

  listarActividades: IListarActividades[] = [];
  listarEmbarques: IEmbarque[] = [];
  filtrarOperacion: IFiltroOperaciones = {};
  filtrarActividadUsuario: IFiltroActividadUsuario = {};
  listarOperaciones: IResponseOperacion[] = [];
  listarActividadesUsuario: IResponseActividadUsuario[] = [];
  fechaSeleccionada: string;
  colorMarker: string;
  listColorsMarkes: string[] = ["yellow", "brown", "green", "blue", "red"];

  markerInicioActividad: any = {};

  markerFinActividad: any = {};

  markerPuntosEntrega: any = {};

  listarLeyendas = [
    {
      name: "Entregado",
      color: "#34a853",
    },
    {
      name: "Motivado",
      color: "#FF7668",
    },
    {
      name: "Inicio de Actividad",
      color: "#FFFF6E",
    },
    {
      name: "Fin de Actividad",
      color: "#6991FD",
    },
    {
      name: "Recorrido",
      color: "#FF0000",
    },
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
    let formatoFecha = new Date(this.fechaSeleccionada).toISOString().slice(0, 10);
    this.filtrarOperacion = {
      intIdActividad: event.option.value.Id_Actividad,
      strUserRegistro: event.option.value.strCodUser,
      dtFechaHoraRegistro: formatoFecha,
    };

    this.filtrarActividadUsuario = {
      intIdActividad: event.option.value.Id_Actividad,
      strUser: event.option.value.strCodUser,
      dtFecha: formatoFecha,
    };

    // Obtener actividades del usuario
    this.usersService
      .obtener_actividades_usuario(this.filtrarActividadUsuario)
      .subscribe((data: any[]) => {
        this.listarActividadesUsuario = [];
        this.markerInicioActividad = {};
        this.markerFinActividad = {};
        data.length == 0
          ? (this.listarActividadesUsuario = [])
          : (this.listarActividadesUsuario = this.listarActividadesUsuario.concat(
              data
            ));

        this.listarActividadesUsuario.forEach((el) => {
          if (el.CxInicio != null && el.CyInicio != null) {
            let markerYellow = Url.URL_MAP_ICON + this.listColorsMarkes[0] + "-dot.png"
            this.markerInicioActividad = {
              CxInicio: el.CxInicio,
              CyInicio: el.CyInicio,
              colorMarker: markerYellow,
            };
          }

          if(el.CxFin != null && el.CyFin != null) {
            let markerBlue = Url.URL_MAP_ICON + this.listColorsMarkes[3] + "-dot.png";
            this.markerFinActividad = {
              CxFin: el.CxFin,
              CyFin: el.CyFin,
              colorMarker: markerBlue,
            };
          }
        });
      });

    // Obtener las operaciones del usuario
    this.usersService
      .obtener_operaciones(this.filtrarOperacion)
      .subscribe((data: any[]) => {
        this.listarOperaciones = [];
        data.length == 0
          ? (this.listarOperaciones = [])
          : (this.listarOperaciones = this.listarOperaciones.concat(data));

        this.listarOperaciones.forEach((prop) => {
          // Validación para los colores del markers
          if (prop.intCodMotivo == 25) {
            let markerGreen = Url.URL_MAP_ICON + this.listColorsMarkes[2] + "-dot.png";
            this.colorMarker = markerGreen;
            // }
          } else if (prop.intCodMotivo == 15) {
            let markerBrown = Url.URL_MAP_ICON + this.listColorsMarkes[1] + "-dot.png";
            this.colorMarker = markerBrown;
            // }
          } else {
            let markerRed = Url.URL_MAP_ICON + this.listColorsMarkes[4] + "-dot.png";
            this.colorMarker = markerRed;
          }
        });
      });
  }

  // Calcular los datos de la tabla.
  public getTotalPendientes() {
    return this.listarActividades
      .map((x) => x.Pendientes)
      .reduce((a, b) => a + b, 0);
  }
  public getTotalConfirmados() {
    return this.listarActividades
      .map((x) => x.Confirmados)
      .reduce((a, b) => a + b, 0);
  }
  public getTotalMotivados() {
    return this.listarActividades
      .map((x) => x.Motivados)
      .reduce((a, b) => a + b, 0);
  }
  public getTotal() {
    return this.listarActividades
      .map((x) => x.Total)
      .reduce((a, b) => a + b, 0);
  }

  /**
   * @Author Dominic AV - 14/04/2020
   * @Summary
   *  Mostrar coordenadas a traves del componente agm-info-window
   */
  mostrarInfoCoordenadas(infoCoordenadas, gm) {
    this.openInfo = true;
    infoCoordenadas.open();
  }
  
  /**
   * @Author Dominic AV - 14/04/2020
   * @Summary
   *  Ocultar coordenadas a traves del componente agm-info-window
   */
  ocultarInfoCoordenadas(infoCoordenadas, gm) {
    if(!this.openInfo) {
      infoCoordenadas.open();
    } else {
      infoCoordenadas.close();
    }
  }

  clickedMarker(infoCoordenadas) {
    this.openInfo = false;
    infoCoordenadas.open();
  }
}
