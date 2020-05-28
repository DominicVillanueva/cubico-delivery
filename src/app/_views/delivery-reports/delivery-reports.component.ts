import { DialogReportComponent } from "./components/dialog-report/dialog-report.component";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Parametros } from "./../../utils/Parametros";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { CourierService } from "./../../services/courier-services/courier.service";
import {
  IEmbarque,
  IFiltroOperaciones,
  IResponseOperacion,
  IFiltroEmbarque,
} from "./../../_models/AdministrarUsuario";
import { FormControl } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { ViewChild } from "@angular/core";
import { Component, OnInit } from "@angular/core";

import { MatTableDataSource } from "@angular/material/table";

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'

@Component({
  selector: "app-delivery-reports",
  templateUrl: "./delivery-reports.component.html",
  styleUrls: ["./delivery-reports.component.scss"],
})
export class DeliveryReportsComponent implements OnInit {
  // Variables para la fecha
  fechaSeleccionada = new FormControl(new Date().toISOString());

  listarEmbarques: IEmbarque[] = [];
  filtrarOperacion: IFiltroOperaciones = {};
  listarOperaciones: IResponseOperacion[] = [];
  filtrarEmbarque: IFiltroEmbarque = {};

  Id_Tra: String = "";
  finOperacion: String = "";

  dataSource: any;

  columnsToDisplay: string[] = [
    "intCode",
    "strBarcode",
    "strSenderName",
    "strAddressRecipient",
    "strCityRecipient",
    "strReceivedBy",
    "dtFinOperacion",
    "intCodMotivo",
    "actions",
  ];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  constructor(
    private courierService: CourierService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getAllEmbarques(this.fechaSeleccionada.value);
  }

  getAllEmbarques(fechaActual) {
    let fechaConsulta = fechaActual.slice(0, 10);
    this.listarEmbarques = [];
    this.courierService
      .obtener_embarques(fechaConsulta)
      .subscribe((data: any[]) => {
        this.listarEmbarques = [];
        if (data.length > 0) {
          this.listarEmbarques = this.listarEmbarques.concat(data);
        }
      });
  }

  public onClick_filtrar_usuarios(event: MatDatepickerInputEvent<Date>) {
    // Limipiar data.
    this.listarEmbarques = [];
    this.dataSource = [];
    this.listarOperaciones = [];

    let formatoFecha = new Date(event.value).toISOString().slice(0, 10);
    this.courierService
      .obtener_embarques(formatoFecha)
      .subscribe((data: any[]) => {
        this.listarEmbarques = [];
        if (data.length > 0) {
          this.listarEmbarques = this.listarEmbarques.concat(data);
        }
      });
  }

  getEmbarqueSelectionChange(obj) {
    let formatoFecha = new Date(this.fechaSeleccionada.value).toISOString().slice(0, 10);

    // Agregar valores seleccionados al objecto filtrarOperacion
    this.filtrarOperacion = {
      intIdActividad: obj.Id_Actividad,
      strUserRegistro: obj.strCodUser,
      dtFechaHoraRegistro: formatoFecha,
    };

    this.Id_Tra = obj.Id_Tra;
  }

  onClick_filter_orders() {
    this.listarOperaciones = [];

    if (
      this.filtrarOperacion.dtFechaHoraRegistro == null ||
      this.filtrarOperacion.intIdActividad == null ||
      this.filtrarOperacion.strUserRegistro == null
    ) {
      this._snackBar.open(
        "¡Seleccionar un encargado!",
        "X",
        Parametros.SNACKBAR_OPTIONS
      );
      return;
    }

    // Obtener las operaciones del usuario
    this.courierService
      .obtener_operaciones(this.filtrarOperacion)
      .subscribe((data: any[]) => {
        if (data.length > 0) {
          this.listarOperaciones = this.listarOperaciones.concat(data);

          this.listarOperaciones.forEach((prop) => {
            if (prop.dtFinOperacion == null) {
              prop.dtFinOperacion = "--";
            } else {
              let jsonFinOperacion = prop.dtFinOperacion
                .replace("/Date(", "")
                .replace("-0500)/", "");
              prop.dtFinOperacion = "";
              prop.dtFinOperacion = new Date(
                JSON.parse(jsonFinOperacion)
              ).toLocaleString();
            }
          });

          this.dataSource = new MatTableDataSource(this.listarOperaciones);
          this.dataSource.paginator = this.paginator;
        } else {
          this.listarOperaciones = [];
        }
      });
  }

  onClick_showDialogReport(idTra, idTx) {
    this.filtrarEmbarque = {
      id_tra: idTra,
      id_tx: idTx,
    };

    this.courierService
      .obtener_imagenes_x_embarque(this.filtrarEmbarque)
      .subscribe((res: any[]) => {
        if (res.length > 0) {
          let base64String =
            "data:image/jpeg;base64," +
            btoa(String.fromCharCode(...new Uint8Array(res[0].RtPhoto)));
          this.dialog.open(DialogReportComponent, {
            width: "500px",
            disableClose: true,
            data: {
              image: base64String,
            },
          });
        }
      });
  }

  showReportDocument() {
    var doc = new jsPDF();
    // Add Data document
    doc.rect(100, 13, 89, 10); // empty square
    doc.text("REPORTE DE ACTIVIDAD", 180, 20, null, null, "right");
    doc.setFontSize(9);
    doc.setFontStyle("bold");
    doc.text("Embarque:", 116, 30, null, null, "right");
    doc.setFontStyle("normal");
    doc.text(this.Id_Tra, 137, 30, null, null, "right");

    doc.setFontSize(9);
    doc.setFontStyle("bold");
    doc.text("Actividad:", 183, 30, null, null, "right");
    doc.setFontStyle("normal");
    doc.text(this.filtrarOperacion.intIdActividad + "", 188, 30, null, null, "right");

    doc.setFontSize(9);
    doc.setFontStyle("bold");
    doc.text("Usuario:", 10, 50, null, null, "left");
    doc.setFontStyle("normal");
    doc.text(this.filtrarOperacion.strUserRegistro, 42, 50, null, null, "left");

    doc.setFontSize(9);
    doc.setFontStyle("bold");
    doc.text("Fecha de Inicio:", 10, 55, null, null, "left");
    doc.setFontStyle("normal");
    doc.text(this.formatDateHoraRegistro(this.filtrarOperacion.dtFechaHoraRegistro), 42, 55, null, null, "left");

    // TABLE
    autoTable(doc, {
      startY: 60,
      margin: {
        horizontal: 5
      },
      body: this.getListarOperacionesTableReport(),
      bodyStyles: {
        fontSize: 6,
      },
      columns: [
        { header: 'Ruta', dataKey: 'strReceivedBy' },
        { header: 'Pedido', dataKey: 'strBarcode' },
        { header: 'Cliente', dataKey: 'strSenderName' },
        { header: 'Dirección', dataKey: 'strAddressRecipient' },
        { header: 'Ciudad', dataKey: 'strCityRecipient' },
        { header: 'Fecha E/R', dataKey: 'dtFinOperacion' },
        { header: 'Estado', dataKey: 'intCodMotivo' }
      ]
    });
    
    doc.setFontSize(9);
    doc.setFontStyle("bold");
    doc.text("Fecha Fin:", 89, 55, null, null, "left");
    doc.setFontStyle("normal");
    doc.text(this.finOperacion, 106, 55, null, null, "left");

    // doc.output("Reporte de Actividad", "");

    doc.save('ReporteActividad.pdf');
  }

  getListarOperacionesTableReport() {
    let data = [];
    this.listarOperaciones.forEach(element => {

      if (element.dtFinOperacion == "--") {
        this.finOperacion = "--";
      } else {
        this.finOperacion == "" ? this.finOperacion = element.dtFinOperacion : this.finOperacion;
        element.dtFinOperacion = element.dtFinOperacion.slice(0, 10);
      }

      data = data.concat(element);
    });
    
    return data;
  }

  formatDateHoraRegistro(dtFechaHoraRegistro) {
    //2020-04-22
    let valueDay = dtFechaHoraRegistro.substring(8,10);
    let valueMonth = dtFechaHoraRegistro.substring(5,7);

    if(valueMonth.charAt(0) == "0") {
      valueMonth = valueMonth.replace("0","");
    }

    let valueYear = dtFechaHoraRegistro.substring(0,4);

    return valueDay + "/" + valueMonth + "/" + valueYear;
  }
}

export interface DialogDataReport {
  image: any[];
}
