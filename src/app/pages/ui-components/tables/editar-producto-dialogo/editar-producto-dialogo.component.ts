import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';




@Component({
  selector: 'app-editar-producto-dialogo',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './editar-producto-dialogo.component.html',
  styleUrl: './editar-producto-dialogo.component.scss'
})
export class EditarProductoDialogoComponent {

   constructor(
    public dialogRef: MatDialogRef<EditarProductoDialogoComponent>,
    @Inject(MAT_DIALOG_DATA) public producto: any
  ) {}

  guardar() {
    this.dialogRef.close(this.producto);
  }

  cancelar() {
    this.dialogRef.close();
  }

}
