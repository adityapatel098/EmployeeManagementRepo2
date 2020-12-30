import { EmployeeExp } from './employeeExp';

export class Employee {
  id: number;
  firstName: string;
  lastName: string;
  emailId: string;
  active: boolean;
  employeeExpList: EmployeeExp[];


  constructor() {//default list size should be 1
        this.employeeExpList=[new EmployeeExp()];
  }
}
