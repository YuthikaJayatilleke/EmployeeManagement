import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Department } from '../models/department-model';
import { Observable, Observer, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  constructor(private http:HttpClient) { }

  formData: Department = new Department;

  readonly apiUrl = "http://localhost:3000";

  getDepartmentList():Observable<Department[]>{
    return this.http.get<Department[]>(this.apiUrl+"/Departments")
  }

  addDepartment(department:Department){
    return this.http.post(this.apiUrl+"/Departments",department)
  }

  deleteDepartment(id:number){
    return this.http.delete(this.apiUrl+"/Departments/"+id)
  }

  updateDepartment(department:Department){
    return this.http.put(this.apiUrl+"/Departments/"+department.id,department)
  }

  private _listners = new Subject<any>();
  listen():Observable<any>{
    return this._listners.asObservable();
  }
  filter(filterBy:string){
    this._listners.next(filterBy);
  }
}
