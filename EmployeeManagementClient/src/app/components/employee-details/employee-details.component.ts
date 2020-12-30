import { Component, OnInit, Input } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee';
import { Router, ActivatedRoute } from '@angular/router';
import { LABELS } from './../../constants/LABELS';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.css']
})
export class EmployeeDetailsComponent implements OnInit {
  //labels and messages
  firstNameLbl:String=LABELS.firstName;
  lastNameLbl:String=LABELS.lastName;
  emailIDLbl:String=LABELS.emailID;
  emplExpLbl:String=LABELS.emplExp;
  noOfYearsLbl:String=LABELS.noOfYears;
  descriptionLbl:String=LABELS.description;
  indexLbl:String=LABELS.index;

  //actual code

  id: number;
  employee: Employee;

  constructor(private route: ActivatedRoute,private router: Router,
    private employeeService: EmployeeService) { }

  ngOnInit() {
    this.employee = new Employee();

    this.id = this.route.snapshot.params['id'];
    
    this.employeeService.getEmployee(this.id)
      .subscribe(data => {
        console.log(data)
        this.employee = data;
      }, error => console.log(error));
  }

  list(){
    this.router.navigate(['employees']);
  }
}
