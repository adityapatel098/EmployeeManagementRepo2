package com.employee.service;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.employee.model.Employee;
import com.employee.repository.EmployeeRepository;

@Service
public class EmployeeService implements UserDetailsService{

	@Autowired private EmployeeRepository empRepo;
	
	@Override
	public UserDetails loadUserByUsername(String emailID) throws UsernameNotFoundException {
		Employee emp=empRepo.findByEmailId(emailID);
		return new User(emp.getEmailId(), emp.getPassword(), new ArrayList<>());
	}

}
