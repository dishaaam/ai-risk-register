package com.internship.tool.repository;

import com.internship.tool.entity.RiskItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RiskItemRepository extends JpaRepository<RiskItem, Long> {
}
