import { DialogData } from './../../dashboard.component';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-detail-entrega',
  templateUrl: './dialog-detail-entrega.component.html',
  styleUrls: ['./dialog-detail-entrega.component.scss']
})
export class DialogDetailEntregaComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DialogDetailEntregaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
