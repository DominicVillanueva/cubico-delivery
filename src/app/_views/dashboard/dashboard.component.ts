import { Url } from "../../utils/Url";
import {
  IEmbarque,
  IListarActividades,
  IFiltroOperaciones,
  IResponseOperacion,
  IResponseActividadUsuario,
  IFiltroActividadUsuario,
  IResponseBultosEmbarque,
  IResponseImagenEmbarque,
  IFiltroEmbarque,
} from "./../../_models/AdministrarUsuario";
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
import { MatDialog } from "@angular/material/dialog";
import { DialogDetailEntregaComponent } from "./components/dialog-detail-entrega/dialog-detail-entrega.component";
import { CourierService } from "src/app/services/courier-services/courier.service";
import { FormControl } from '@angular/forms';

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
  openInfoInicio: boolean = false;
  openInfoFin: boolean = false;
  openDetailInicio: boolean = false;
  openDetailFin: boolean = false;
  // openInfoPuntos: boolean[] = [false];
  openInfoPuntos: boolean = false;
  openDetailPuntos: boolean = false;
  openedWindow: number = 0;
  openedWindowInfo: number = 0;
  jsonParseDate: Date;

  listarActividades: IListarActividades[] = [];
  listarEmbarques: IEmbarque[] = [];
  filtrarOperacion: IFiltroOperaciones = {};
  filtrarActividadUsuario: IFiltroActividadUsuario = {};
  filtrarEmbarque: IFiltroEmbarque = {};
  listarOperaciones: IResponseOperacion[] = [];
  listarActividadesUsuario: IResponseActividadUsuario[] = [];
  listarBultosEmbarque: IResponseBultosEmbarque[] = [];
  listarImagenesEmbarque: IResponseImagenEmbarque[] = [];
  fechaSeleccionada = new FormControl((new Date()).toISOString());
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

  constructor(
    private courierService: CourierService,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.getAllEmbarques(this.fechaSeleccionada.value);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public getAllEmbarques(fechaActual) {
    let fechaConsulta = fechaActual.slice(0, 10);
    this.listarEmbarques = [];
    this.courierService
      .obtener_embarques(fechaConsulta)
      .subscribe((data: any[]) => {
        this.listarEmbarques = [];
        if(data.length > 0) {
          this.listarEmbarques = this.listarEmbarques.concat(data)
        }
      });
    
    this.selectedOnlyOne();
    this.obtener_actividades_x_fecha(fechaConsulta);
  }

  public onClick_filtrar_usuarios(event: MatDatepickerInputEvent<Date>) {
    // Limipiar data.
    this.listarEmbarques = [];
    this.listarActividades = [];
    this.dataSource = [];

    let formatoFecha = new Date(event.value).toISOString().slice(0, 10);
    this.courierService
      .obtener_embarques(formatoFecha)
      .subscribe((data: any[]) => {
        this.listarEmbarques = [];
        if(data.length > 0) {
          this.listarEmbarques = this.listarEmbarques.concat(data)
        }
      });

    this.selectedOnlyOne();
    this.obtener_actividades_x_fecha(formatoFecha);
  }

  public obtener_actividades_x_fecha(fecha) {
    this.courierService.obtener_actividades(fecha).subscribe((data: any[]) => {
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
    let formatoFecha = new Date(this.fechaSeleccionada.value).toISOString().slice(0, 10);
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
    this.courierService
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
            let jsonFechaInicio = el.InicioActividad.replace(
              "/Date(",
              ""
            ).replace("-0500)/", "");
            let jsonParseFecha = new Date(JSON.parse(jsonFechaInicio));
            let markerYellow =
              Url.URL_MAP_ICON + this.listColorsMarkes[0] + "-dot.png";
            this.markerInicioActividad = {
              CxInicio: el.CxInicio,
              CyInicio: el.CyInicio,
              colorMarker: markerYellow,
              fechaInicio: jsonParseFecha,
            };
          }

          if (el.CxFin != null && el.CyFin != null) {
            let jsonFechaInicio = el.FinActividad.replace("/Date(", "").replace(
              "-0500)/",
              ""
            );
            let jsonParseFecha = new Date(JSON.parse(jsonFechaInicio));
            let markerBlue =
              Url.URL_MAP_ICON + this.listColorsMarkes[3] + "-dot.png";
            this.markerFinActividad = {
              CxFin: el.CxFin,
              CyFin: el.CyFin,
              colorMarker: markerBlue,
              fechaFin: jsonParseFecha,
            };
          }
        });
      });

    // Obtener las operaciones del usuario
    this.courierService
      .obtener_operaciones(this.filtrarOperacion)
      .subscribe((data: any[]) => {
        this.listarOperaciones = [];
        data.length == 0
          ? (this.listarOperaciones = [])
          : (this.listarOperaciones = this.listarOperaciones.concat(data));

        this.listarOperaciones.forEach((prop) => {
          let jsonHoraRegistro = prop.dtFechaHoraRegistro
            .replace("/Date(", "")
            .replace("-0500)/", "");
          let parseFecha = new Date(JSON.parse(jsonHoraRegistro));
          // Validación para los colores del markers
          if (prop.intCodMotivo == 25) {
            let markerGreen =
              Url.URL_MAP_ICON + this.listColorsMarkes[2] + "-dot.png";
            this.colorMarker = markerGreen;
            this.jsonParseDate = parseFecha;
            // }
          } else if (prop.intCodMotivo == 15) {
            let markerBrown =
              Url.URL_MAP_ICON + this.listColorsMarkes[1] + "-dot.png";
            this.colorMarker = markerBrown;
            // }
          } else {
            let markerRed =
              Url.URL_MAP_ICON + this.listColorsMarkes[4] + "-dot.png";
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

  public mostrarInfoCoordenadas(tipo: string, i: number) {
    if (tipo == "inicio") {
      if (!this.openDetailInicio) {
        this.openInfoInicio = true;
      }
    }

    if (tipo == "fin") {
      if (!this.openDetailFin) {
        this.openInfoFin = true;
      }
    }

    if (tipo == "puntos") {
      if (this.listarOperaciones.length == 1) {
        if (!this.openDetailPuntos) {
          this.openInfoPuntos = true;
        }
      } else {
        if (!this.openDetailPuntos) {
          this.openInfoPuntos = true;
          this.openDetailPuntos = false;
          this.openedWindowInfo = i;
          this.isInfoWindowOpen(this.openedWindowInfo);
        }
      }
    }
  }
  public ocultarInfoCoordenadas(tipo: string, index: number) {
    if (tipo == "inicio") {
      this.openInfoInicio = false;
    }

    if (tipo == "fin") {
      this.openInfoFin = false;
    }

    if (tipo == "puntos") {
      if (this.listarOperaciones.length == 1) {
        this.openInfoPuntos = false;
      } else {
        this.openInfoPuntos = false;
        this.openDetailPuntos = false;
        this.openedWindowInfo = 0;
        this.isInfoWindowOpen(this.openedWindowInfo);

        if (this.openedWindow == 0) {
          this.openedWindow = 0;
        } else {
          this.isInfoDetailWindowOpen(0);
        }
      }
    }
  }
  public clickedMarker(tipo: string, index: number) {
    if (tipo == "inicio") {
      this.openInfoInicio = false;
      this.openDetailInicio = true;
      this.openDetailFin = false;
      this.openDetailPuntos = false;
    }

    if (tipo == "fin") {
      this.openInfoFin = false;
      this.openDetailFin = true;
      this.openDetailInicio = false;
      this.openDetailPuntos = false;
    }

    if (tipo == "puntos") {
      this.openInfoPuntos = false;
      this.openDetailPuntos = true;
      this.openDetailInicio = false;
      this.openDetailFin = false;
      if (this.listarOperaciones.length > 1) {
        this.openedWindow = index;
        this.isInfoDetailWindowOpen(this.openedWindow);
      }
    }
  }

  public activarMostrarInfoCoordenadas(tipo: string, index: number) {
    if (tipo == "init") {
      this.openDetailInicio = false;
    }

    if (tipo == "fin") {
      this.openDetailFin = false;
    }

    if (tipo == "puntos") {
      this.openDetailPuntos = false;
      if (this.listarOperaciones.length > 1) {
        if (this.openedWindow != 0) {
          this.openedWindow = 0;
          this.isInfoDetailWindowOpen(this.openedWindow);
        } else {
          // this.openedWindow = 0;
          this.isInfoDetailWindowOpen(index);
        }
      }
    }
  }

  public isInfoDetailWindowOpen(index: number) {
    if (index == 0) {
      return false;
    } else {
      return this.openedWindow == index ? true : false;
    }
  }

  public isInfoWindowOpen(index: number) {
    return this.openedWindowInfo == index ? true : false;
  }

  public onClick_showDetail(idTra, idTx) {

    this.filtrarEmbarque = {
      id_tra: idTra,
      id_tx: idTx,
    };

    this.courierService.obtener_bultos_x_embarque(this.filtrarEmbarque)
      .subscribe((data: any[]) => {
        this.listarBultosEmbarque = [];
        if(data.length > 0) {
          // this.listarBultosEmbarque = this.listarBultosEmbarque.concat(data);
          let objListBultos = {};
          data.forEach(prop => {
            let jsonFechaCourier = prop.FechaCurier.replace("/Date(","").replace("-0500)/", "");
            let jsonParseFecha = new Date(JSON.parse(jsonFechaCourier)).toLocaleString();
            objListBultos = {
              Bulto: prop.Bulto,
              FechaCurier: jsonParseFecha
            }

            this.listarBultosEmbarque.push(objListBultos);
          });
        }
      });

      this.courierService.obtener_imagenes_x_embarque(this.filtrarEmbarque).subscribe((res: any[]) => {
        this.listarImagenesEmbarque = [];
        if(res.length > 0) {
          let base64String = "data:image/jpeg;base64," + btoa(String.fromCharCode(...new Uint8Array(res[0].RtPhoto)));
          this.dialog.open(DialogDetailEntregaComponent, {
            width: "500px",
            disableClose: true,
            data: {
              image: base64String,
              listBultoEmbarque: this.listarBultosEmbarque,
            },
          });
        }
      });
  }
}

export interface DialogData {
  image: any[];
  listBultoEmbarque: any[];
}