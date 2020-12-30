package com.employee.controller;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.employee.exception.ResourceNotFoundException;
import com.employee.model.Employee;
import com.employee.model.EmployeeExp;
import com.employee.repository.EmployeeExpRepository;
import com.employee.repository.EmployeeRepository;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/v1")
public class EmployeeController {
	@Autowired
	private EmployeeRepository employeeRepository;
	
	@Autowired
	private EmployeeExpRepository employeeExpRepository;
	
	@GetMapping("/employees")
	public List<Employee> getAllEmployees() {
		return employeeRepository.findAll();
	}

	@GetMapping("/employees/{id}")
	public ResponseEntity<Employee> getEmployeeById(@PathVariable(value = "id") Long employeeId)
			throws ResourceNotFoundException {
		Employee employee = employeeRepository.findById(employeeId)
				.orElseThrow(() -> new ResourceNotFoundException("Employee not found for this id :: " + employeeId));
		return ResponseEntity.ok().body(employee);
	}

	@PostMapping("/employees")
	public ResponseEntity<Object>  createEmployee(@Valid @RequestBody Employee employee,BindingResult result) {   
		Map<String, Set<String>> errors = setServerErrors(result);
		    if (errors.isEmpty()) {
		    	List<EmployeeExp> empExpList= employee.getEmployeeExpList();
		    	for(EmployeeExp eachEmpExp:empExpList) {
		    		eachEmpExp.setEmployee(employee);
		    	}
		    	employeeRepository.save(employee);
		    	return new ResponseEntity<Object>(employee, HttpStatus.OK) ;
		    }
		    else {
		    	return new ResponseEntity<Object>(errors, HttpStatus.UNPROCESSABLE_ENTITY);
		    }
		    
	}

	@PutMapping("/employees/{id}")
	public ResponseEntity<Object> updateEmployee(@PathVariable(value = "id") Long employeeId,
			@Valid @RequestBody Employee employeeDetails,BindingResult result) throws ResourceNotFoundException {
		Map<String, Set<String>> errors = setServerErrors(result);
		if (errors.isEmpty()) {
			Employee employee = employeeRepository.findById(employeeId)
					.orElseThrow(() -> new ResourceNotFoundException("Employee not found for this id :: " + employeeId));
			employee.setEmailId(employeeDetails.getEmailId());
			employee.setLastName(employeeDetails.getLastName());
			employee.setFirstName(employeeDetails.getFirstName());
			
			//setting new list for entry
			List<EmployeeExp> empExpList= employee.getEmployeeExpList();
			empExpList.clear();
			empExpList.addAll(employeeDetails.getEmployeeExpList());
			
	    	for(EmployeeExp eachEmpExp:empExpList) {
	    		eachEmpExp.setEmployee(employee);
	    	}
	    	
	    	System.out.println(employee);
	    	//saving updated data
			final Employee updatedEmployee = employeeRepository.save(employee);
			return ResponseEntity.ok(updatedEmployee);
		}
		else {
			return new ResponseEntity<Object>(errors, HttpStatus.UNPROCESSABLE_ENTITY);
		}
	}

	@DeleteMapping("/employees/{id}")
	public Map<String, Boolean> deleteEmployee(@PathVariable(value = "id") Long employeeId)
			throws ResourceNotFoundException {
		Employee employee = employeeRepository.findById(employeeId)
				.orElseThrow(() -> new ResourceNotFoundException("Employee not found for this id :: " + employeeId));

		employeeRepository.delete(employee);
		Map<String, Boolean> response = new HashMap<>();
		response.put("deleted", Boolean.TRUE);
		return response;
	}
	
	private Map<String, Set<String>> setServerErrors(BindingResult result) {
		Map<String, Set<String>> errors = new HashMap<>();
		 for (FieldError fieldError : result.getFieldErrors()) {
		      String code = fieldError.getCode();
		      String field = fieldError.getField();
		      if (code.equals("NotBlank") || code.equals("NotNull")) {
		        errors.computeIfAbsent(field, key -> new HashSet<>()).add("required");
		      }
		 }
		 return errors;
	}
}