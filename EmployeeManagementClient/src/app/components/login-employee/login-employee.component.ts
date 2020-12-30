import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { LABELS } from './../../constants/LABELS';

@Component({
  selector: 'app-login-employee',
  templateUrl: './login-employee.component.html',
  styleUrls: ['./login-employee.component.css']
})
export class LoginEmployeeComponent implements OnInit {

  //labels and messages

  emailIDLbl:String=LABELS.emailID;
  submitLbl:String=LABELS.submit;
  passwordLbl:String=LABELS.password;

  //Actual Code
  formGroup: FormGroup;
  employee: Employee;
  submitted = false;
  id: number;
  tempFeildName:String=null;

  constructor(private route: ActivatedRoute,private router: Router,
    private employeeService: EmployeeService,private fb: FormBuilder) {
      //form validations
      this.formGroup = fb.group({
        emailId:   ['', [Validators.required, Validators.email]],
        password:   ['', [Validators.required]],
        }); 
    }   
        
        
  ngOnInit() {
    this.employee= new Employee();
    }


 
  onSubmit() {
    this.employeeService.login(this.employee).subscribe(data=>{
      alert(data);
    });
    this.submitted = true;   
    this.gotoList();
  }

  //redirect to listing page
  gotoList() {
    this.router.navigate(['/employees']);
  }

  //getters to directly access each form controls from the template
  get emailId() {
    return this.formGroup.get('emailId');
  }

  get password() {
    return this.formGroup.get('password');
  }




  //Set Server Errors
  setServerError(errorData:any){
    for (const fieldName of Object.keys(errorData)) {
      const serverErrors = errorData[fieldName];
      
      const errors = {};
      for (const serverError of serverErrors) {
        errors[serverError] = true;
      }

      const index=fieldName. substring(fieldName. lastIndexOf("[") + 1,fieldName. lastIndexOf("]"));
      const name=fieldName. substring(fieldName. lastIndexOf(".") + 1);
      const control = fieldName.includes("employeeExpList") ? this.formGroup.get(["employeeExpList",index,name]) : this.formGroup.get(fieldName);
      
      control.setErrors(errors);
      control.markAsDirty();

      this.markFormGroupTouched(this.formGroup);
  
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }


  
}
