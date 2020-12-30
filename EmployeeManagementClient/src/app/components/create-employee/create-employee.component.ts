import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { LABELS } from './../../constants/LABELS';
import { EmployeeExp } from 'src/app/models/employeeExp';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})

export class CreateEmployeeComponent implements OnInit {

  //labels and messages
  createEmployeeTitle:String=LABELS.createEmplTitle;
  updateEmployeeTitle:String=LABELS.updateEmplTitle;
  firstNameLbl:String=LABELS.firstName;
  lastNameLbl:String=LABELS.lastName;
  emailIDLbl:String=LABELS.emailID;
  emplExpLbl:String=LABELS.emplExp;
  noOfYearsLbl:String=LABELS.noOfYears;
  descriptionLbl:String=LABELS.description;
  indexLbl:String=LABELS.emplExp;
  addLbl:String=LABELS.add;
  deleteLbl:String=LABELS.delete;
  submitLbl:String=LABELS.submit;

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
        firstName: ['', [Validators.required, Validators.maxLength(20)]],
        lastName:  ['', [Validators.required, Validators.maxLength(20)]],
        emailId:   ['', [Validators.required, Validators.email]],
        employeeExpList :this.fb.array([this.fb.group({years:['',[Validators.required]],description:['',[Validators.required]]})])
      }); 
    }   
        
        
  ngOnInit() {
    this.employee= new Employee();
    this.id = this.route.snapshot.params['id'];
    if(this.id){
      this.employeeService.getEmployee(this.id)
      .subscribe(data => {
        
        // this.employee = data;
        for (var key in data) {
          const fieldName=key;
          if(fieldName.includes("employeeExpList")){
            for(let i=0;i<data[key].length-1;i++){
              this.employee.employeeExpList.push(new EmployeeExp());
            }
            for(var key2 in data[key]){
              for(var key3 in data[key][key2]){
                this.employee[key][key2][key3] = data[key][key2][key3];
              }
            }
          }
         else{
          if (this.employee.hasOwnProperty(key)) {
            this.employee[key] = data[key];
          }
         }
        }
        
        console.log(this.employee.employeeExpList.pop)
        for (let i = 0; i < this.employee.employeeExpList.length-1; i++) {
          this.employeeExpList.push(this.fb.group({years:['',[]],description:['',[]]}));
        }
        console.log(this.employee)
      }, error => console.log(error)
      );

     }
    }
  //create
  save() {
    console.log(this.employee);
    this.employeeService
    .createEmployee(this.employee).subscribe(data => {
      console.log(data)
      this.employee = new Employee();
      this.gotoList();
    }, 
    httpErrorRes => {
      this.setServerError(httpErrorRes.error);
    });
  }

  //edit
  updateEmployee() {
    this.employeeService.updateEmployee(this.id, this.employee)
      .subscribe(data => {
        console.log(data);
        this.employee = new Employee();
        this.gotoList();
      }, httpErrorRes =>{
        this.setServerError(httpErrorRes.error);
      });
  }

  //on edit or create
  onSubmit() {
    this.submitted = true;
    if(this.id){//for edit 
      this.updateEmployee();  
    }
    else{//for create
      this.save(); 
    }
       
  }

  //redirect to listing page
  gotoList() {
    this.router.navigate(['/employees']);
  }

  //getters to directly access each form controls from the template
  get firstName() {
    return this.formGroup.get('firstName');
  }
  
  get lastName() {
    return this.formGroup.get('lastName');
  }
  
  get emailId() {
    return this.formGroup.get('emailId');
  }

  get employeeExpList(): FormArray {
    return this.formGroup.get('employeeExpList') as FormArray;
  }
  
  // getters for dynamic field form grp
  //years
  getYearsValid(i):boolean {
    return (<FormArray>this.formGroup.get('employeeExpList')).controls[i].get('years').touched  && (<FormArray>this.formGroup.get('employeeExpList')).controls[i].get('years').invalid;
  }
  
  getYearsRequied(i):boolean {
    return (<FormArray>this.formGroup.get('employeeExpList')).controls[i].get('years').touched && (<FormArray>this.formGroup.get('employeeExpList')).controls[i].get('years').errors.required;
  }
  //description
  getDescriptionValid(i):boolean {
    return (<FormArray>this.formGroup.get('employeeExpList')).controls[i].get('description').touched && (<FormArray>this.formGroup.get('employeeExpList')).controls[i].get('description').invalid;
  }
  
  getDescriptionRequied(i):boolean {
    return (<FormArray>this.formGroup.get('employeeExpList')).controls[i].get('description').touched && (<FormArray>this.formGroup.get('employeeExpList')).controls[i].get('description').errors.required;
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

  // add remove Experince Colmns
  deleteEmployeeExp(row){
    if(this.employee.employeeExpList.length == 1) {  
      return false;  
   } 
   else {  
    this.employee.employeeExpList.splice(row,1);  
      return true;  
   }
    
  }

  addEmployeeExp(){
    const tempExp=new EmployeeExp();
    this.employee.employeeExpList.push(tempExp);
    console.log(this.employee);
    this.employeeExpList.push(this.fb.group({years:['',[Validators.required]],description:['',[Validators.required]]}));
  }

  
}
