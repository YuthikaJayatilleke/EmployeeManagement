import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import { Department } from 'src/app/models/department-model';
import { DepartmentService } from 'src/app/services/department.service';
import {MatDialog,MatDialogConfig} from '@angular/material/dialog';
import { DepartmentAddComponent } from '../department-add/department-add.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import{ConfirmationDialogComponent} from 'src/app/utilities/confirmation-dialog/confirmation-dialog.component'
import { DepartmentEditComponent } from '../department-edit/department-edit.component';
import {AuthenticationService}  from 'src/app/services/authentication.service';

@Component({
  selector: 'app-department-show',
  templateUrl: './department-show.component.html',
  styleUrls: ['./department-show.component.css']
})
export class DepartmentShowComponent implements OnInit {

  constructor(private service:DepartmentService, private dialog:MatDialog, private snackBar:MatSnackBar,public authService:AuthenticationService) { 
   this.service.listen().subscribe((m:any)=>{
      console.log(m);
      this.refreshDepartmentList()
   }
   )

  }

  listDepartmentData!: MatTableDataSource<any>;
  displayedColumns:string[]=['code','name','options']

  @ViewChild(MatSort, { static: true })
  sort!: MatSort;

  ngOnInit(): void {
    this.refreshDepartmentList();
    if(!this.authService.isAuthenticated){
      this.authService.logout();
    }
  }

  refreshDepartmentList(){
    this.service.getDepartmentList().subscribe(data => {
      this.listDepartmentData = new MatTableDataSource(data);
      this.listDepartmentData.sort = this.sort;
    });
 
  }

  onEdit(dep:Department){
    console.log('Edit')
    this.service.formData = dep;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus=true;
    dialogConfig.width="30%"
    this.dialog.open(DepartmentEditComponent,dialogConfig)
  }

  onDelete(id:number){
    const dialogRef = this.dialog.open(ConfirmationDialogComponent,{
      data:{
        message: 'Are you sure you want to delete this department?',
        buttonText: {
          ok: 'Delete',
          cancel: 'Cancel'
        }
      }
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        const a = document.createElement('a');
        a.click();
        a.remove();

          this.service.deleteDepartment(id).subscribe(respones =>
        {
              this.refreshDepartmentList();
              this.snackBar.open("Successfully deleted !",'',
              {
                duration:7000,
                verticalPosition:'top'
              }
              )
        }, error =>{
          this.refreshDepartmentList();
              this.snackBar.open(error.message,'',
              {
                duration:10000,
                verticalPosition:'top'
              }
              )
        })
      }
    });
  }

  onAdd(){
   const dialogConfig = new MatDialogConfig();
   dialogConfig.disableClose = true;
   dialogConfig.autoFocus=true;
   dialogConfig.width="30%"
   this.dialog.open(DepartmentAddComponent,dialogConfig)
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.listDepartmentData.filter = filterValue.trim().toLowerCase();
  }

}
