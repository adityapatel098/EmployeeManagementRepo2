package com.employee.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import com.employee.model.EmployeeExp;

@Repository
public interface EmployeeExpRepository extends CrudRepository<EmployeeExp, Long>{

}
