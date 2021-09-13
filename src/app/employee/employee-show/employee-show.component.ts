import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import { Employee } from 'src/app/models/employee-model';
import { EmployeeService } from 'src/app/services/employee.service';
import {MatDialog,MatDialogConfig} from '@angular/material/dialog';
import { EmployeeAddComponent } from '../employee-add/employee-add.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import{ConfirmationDialogComponent} from 'src/app/utilities/confirmation-dialog/confirmation-dialog.component'
import { EmployeeEditComponent } from '../employee-edit/employee-edit.component';
import {AuthenticationService}  from 'src/app/services/authentication.service';

@Component({
  selector: 'app-employee-show',
  templateUrl: './employee-show.component.html',
  styleUrls: ['./employee-show.component.css']
})
export class EmployeeShowComponent implements OnInit {

  constructor(private service:EmployeeService, private dialog:MatDialog, private snackBar:MatSnackBar,public authService:AuthenticationService) { 
    this.service.listen().subscribe((m:any)=>{
      console.log("callService");
      this.refreshEmployeeList()
   }
   )
  }

  listEmployeeData!: MatTableDataSource<any>;
  displayedColumns:string[]=['code','name','mobileNo','email','options']

  @ViewChild(MatSort, { static: true })
  sort!: MatSort;


  ngOnInit(): void {
    this.refreshEmployeeList();
    if(!this.authService.isAuthenticated){
      this.authService.logout();
    }
  }

  refreshEmployeeList(){
    this.service.getEmployeeList().subscribe(data => {
      this.listEmployeeData = new MatTableDataSource(data);
      this.listEmployeeData.sort = this.sort;
    });
  }

  onEdit(emp:Employee){
    console.log('Edit')
    this.service.formData = emp;
    this.service.isShowUpdateButton = true;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus=true;
    dialogConfig.width="60%";
    this.dialog.open(EmployeeEditComponent,dialogConfig)
  }

  ageCalculator(emp:Employee){
    if(emp.dob != null){
      console.log(emp.dob);
      const timeDiff = Math.abs(Date.now() - new Date(emp.dob).getTime());
       emp.age = Math.floor((timeDiff / (1000 * 3600 * 24))/365);
    }else{
      emp.age = 0;
    }
  }

  onShow(emp:Employee){
    this.service.isShowUpdateButton = false;
    console.log('Show')
    this.ageCalculator(emp);
    this.service.formData = emp;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus=true;
    dialogConfig.width="60%";
    this.dialog.open(EmployeeEditComponent,dialogConfig)
  }
  onDelete(id:number){
    const dialogRef = this.dialog.open(ConfirmationDialogComponent,{
      data:{
        message: 'Are you sure you want to remove this employee?',
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

          this.service.deleteEmployee(id).subscribe(respones =>
        {
              this.refreshEmployeeList();
              this.snackBar.open("Successfully deleted !",'',
              {
                duration:7000,
                verticalPosition:'top'
              }
              )
        }, error =>{
          this.refreshEmployeeList();
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
   dialogConfig.width="60%"
   this.dialog.open(EmployeeAddComponent,dialogConfig)
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.listEmployeeData.filter = filterValue.trim().toLowerCase();
  }

  applyFilterByEmail(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if(filterValue == ""){
      this.refreshEmployeeList()
    }else{
      var filteredArray2  = this.listEmployeeData.data.filter(
        emp => emp.email.toLowerCase() == filterValue.trim().toLowerCase());
        if(filteredArray2.length != 0){
          console.log(filteredArray2)
          this.listEmployeeData.data = filteredArray2;
         }
    }

  }

  applyFilterByName(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if(filterValue == ""){
      this.refreshEmployeeList()
    }else{
    var filteredArray2  = this.listEmployeeData.data.filter(
      emp => (emp.firstName.toLowerCase() == filterValue.trim().toLowerCase()
      )
      );
      if(filteredArray2.length != 0){
        console.log(filteredArray2)
        this.listEmployeeData.data = filteredArray2;
       }
      }
    }

}
