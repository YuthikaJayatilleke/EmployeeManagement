import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Employee } from '../models/employee-model';
import { Observable, Observer, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http:HttpClient) { }

  formData: Employee = new Employee;
  isShowUpdateButton:boolean = true;
  readonly apiUrl = "http://localhost:3000";

  getEmployeeList():Observable<Employee[]>{
    return this.http.get<Employee[]>(this.apiUrl+"/Employees")
  }

  addEmployee(employee:Employee){
    return this.http.post(this.apiUrl+"/Employees",employee)
  }

  deleteEmployee(id:number){
    return this.http.delete(this.apiUrl+"/Employees/"+id)
  }

  updateEmployee(employee:Employee){
    return this.http.put(this.apiUrl+"/Employees/"+employee.id,employee)
  }

  private _listners = new Subject<any>();
  listen():Observable<any>{
    return this._listners.asObservable();
  }
  filter(filterBy:string){
    this._listners.next(filterBy);
  }
}
