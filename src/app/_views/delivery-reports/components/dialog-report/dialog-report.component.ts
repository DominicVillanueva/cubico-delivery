import { DialogDataReport } from './../../delivery-reports.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-dialog-report',
  templateUrl: './dialog-report.component.html',
  styleUrls: ['./dialog-report.component.scss']
})
export class DialogReportComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DialogReportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogDataReport) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
