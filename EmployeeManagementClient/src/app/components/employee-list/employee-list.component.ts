import { Observable } from "rxjs";
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee';
import { Component, OnInit } from "@angular/core";
import { Router } from '@angular/router';
import {LABELS} from './../../constants/LABELS'

@Component({
  selector: "app-employee-list",
  templateUrl: "./employee-list.component.html",
  styleUrls: ["./employee-list.component.css"]
})
export class EmployeeListComponent implements OnInit {
//lables and messages
firstNameLbl:String=LABELS.firstName;
lastNameLbl:String=LABELS.lastName;
emailIDLbl:String=LABELS.emailID;
actionsLbl:String=LABELS.actions;
updateLbl:String=LABELS.update;
detailsLbl:String=LABELS.details;
deleteLbl:String=LABELS.delete;

//actual code
  employees: Observable<Employee[]>;

  constructor(private employeeService: EmployeeService,
    private router: Router) {}

  ngOnInit() {
    this.reloadData();
  }

  reloadData() {
    this.employees = this.employeeService.getEmployeesList();
  }

  deleteEmployee(id: number) {
    this.employeeService.deleteEmployee(id)
      .subscribe(
        data => {
          console.log(data);
          this.reloadData();
        },
        error => console.log(error));
  }

  employeeDetails(id: number){
    this.router.navigate(['details', id]);
  }

  updateEmployee(id: number){
    this.router.navigate(['update', id]);
  }
}
