import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef,MatDialog } from '@angular/material/dialog';
import { EmployeeService } from 'src/app/services/employee.service';
import { DepartmentService } from 'src/app/services/department.service';
import {MatSnackBar} from '@angular/material/snack-bar'
import{ConfirmationDialogComponent} from 'src/app/utilities/confirmation-dialog/confirmation-dialog.component';
@Component({
  selector: 'app-employee-add',
  templateUrl: './employee-add.component.html',
  styleUrls: ['./employee-add.component.css']
})
export class EmployeeAddComponent implements OnInit {

  constructor(public dialogbox:MatDialogRef<EmployeeAddComponent>, public service:EmployeeService, private dialog:MatDialog,public departmentService:DepartmentService, private snackBar:MatSnackBar) { }

  public departments : Array<string> = [];
  public mobileNumberPattern = "^((\\+91-?)|0)?[0-9]{10}$";
  public emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
  public nicPattern1= "^[0-9]{9}[vVxX]$";
  public nicPattern2= "^[0-9]{12}$";
  public seasons: string[] = ['Male', 'Female'];
  public url = "https://beebit.de/en/association/anon.svg";
  public value:string = "Credit card";

  ngOnInit(): void {
    this.resetForm();
    this.dropdownRefresh();
  }
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
        message: 'Are you sure you want to add this employee?',
        buttonText: {
          ok: 'Save',
          cancel: 'Cancel'
        }
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        const a = document.createElement('a');
        a.click();
        a.remove();
        this.service.addEmployee(form.value).subscribe(respones =>
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
    this.service.formData={id : 0,age:0,isActive:true,code:'',nic:'',dateJoined:new Date(),designation:"", firstName:'',lastName:'',email:'',dob:new Date(),
     address:'',gender:'',department:'',departmentId:0,imagePath:'',mobileNo:'',pfNumber:''
   }
  }
}
