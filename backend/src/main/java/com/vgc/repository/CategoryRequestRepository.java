package com.vgc.repository;

import com.vgc.entity.CategoryRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CategoryRequestRepository extends JpaRepository<CategoryRequest, Long> {
    List<CategoryRequest> findByStatus(String status);
    List<CategoryRequest> findByRequesterId(Long requesterId);
}
