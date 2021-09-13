import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef,MatDialog } from '@angular/material/dialog';
import { EmployeeService } from 'src/app/services/employee.service';
import { DepartmentService } from 'src/app/services/department.service';
import {MatSnackBar} from '@angular/material/snack-bar'
import{ConfirmationDialogComponent} from 'src/app/utilities/confirmation-dialog/confirmation-dialog.component';
@Component({
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html',
  styleUrls: ['./employee-edit.component.css']
})
export class EmployeeEditComponent implements OnInit {

  constructor(public dialogbox:MatDialogRef<EmployeeEditComponent>,  private dialog:MatDialog,public service:EmployeeService,public departmentService:DepartmentService, private snackBar:MatSnackBar) {}
  ngOnInit(): void {
    this.dropdownRefresh();
  }

  public departments : Array<string> = [];
  public mobileNumberPattern = "^((\\+91-?)|0)?[0-9]{10}$";
  public emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
  public seasons: string[] = ['Male', 'Female'];
  public url = "https://beebit.de/en/association/anon.svg";
  public value:string = "Credit card";
  public nicPattern1= "^[0-9]{9}[vVxX]$";
  public nicPattern2= "^[0-9]{12}$";

  onClose(){
    this.service.filter("Close")
    this.dialogbox.close();
  }

  selectFile(event: any) {
     if(event.target.files){
      var redader = new FileReader();
      redader.readAsDataURL(event.target.files[0])
      redader.onload = (event:any) => {
        this.url = event.target.result;
      }
     }
  }

  dropdownRefresh(){
    this.departmentService.getDepartmentList().subscribe(response=>{
      response.forEach(element => {
        this.departments.push(element.name);
      });
    })
  }

  onSubmit(form:NgForm){
    console.log(form.value);
    const dialogRef = this.dialog.open(ConfirmationDialogComponent,{
      data:{
        message: 'Are you sure you want to update this employee?',
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
        this.service.updateEmployee(form.value).subscribe(respones =>
          {
                this.resetForm(form);
                this.snackBar.open("Sussesfuly Save",'',
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
      }})
  }

  resetForm(form?:NgForm){
    if(form != null){
      form.resetForm();
    }
    this.service.formData={id : 0,age:0, isActive:true,dateJoined:new Date(),designation:"", code:'', firstName:'',lastName:'',email:'',dob:new Date(),
     address:'',gender:'',nic:'',department:'',departmentId:0,imagePath:'',mobileNo:'',pfNumber:''
   }
  }

}
