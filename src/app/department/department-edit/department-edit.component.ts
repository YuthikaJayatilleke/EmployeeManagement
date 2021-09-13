import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef,MatDialog } from '@angular/material/dialog';
import { DepartmentService } from 'src/app/services/department.service';
import {MatSnackBar} from '@angular/material/snack-bar'
import{ConfirmationDialogComponent} from 'src/app/utilities/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-department-edit',
  templateUrl: './department-edit.component.html',
  styleUrls: ['./department-edit.component.css']
})
export class DepartmentEditComponent implements OnInit {

  constructor(public dialogbox:MatDialogRef<DepartmentEditComponent>, private dialog:MatDialog,public service:DepartmentService, private snackBar:MatSnackBar) { }

  ngOnInit(): void {
  }
  onClose(){
    this.service.filter("Close")
    this.dialogbox.close();
  }

  onSubmit(form:NgForm){

    const dialogRef = this.dialog.open(ConfirmationDialogComponent,{
      data:{
        message: 'Are you sure you want to update this department?',
        buttonText: {
          ok: 'Update',
          cancel: 'Cancel'
        }
      }
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        const a = document.createElement('a');
        a.click();
        a.remove();
        this.service.updateDepartment(form.value).subscribe(respones =>
          {
                this.resetForm(form);
                this.snackBar.open("Sussesfuly Updated",'',
                {
                  duration:7000,
                  verticalPosition:'top'
                }
                )
                this.service.filter("Close")
                this.dialogbox.close();
          }, error =>{
            this.resetForm(form);
                this.snackBar.open(error.message,'',
                {
                  duration:10000,
                  verticalPosition:'top'
                }
                )
                this.service.filter("Close")
                this.dialogbox.close();
          }
         )
      }});

  }


  resetForm(form?:NgForm){
    if(form != null){
      form.resetForm();
    }
    this.service.formData={id : 0,code:'', name:''}
  }
}
