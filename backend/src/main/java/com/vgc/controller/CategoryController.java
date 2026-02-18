package com.vgc.controller;

import com.vgc.dto.CategoryRequestDto;
import com.vgc.dto.CategoryRequestResponse;
import com.vgc.dto.CategoryResponse;
import com.vgc.entity.User;
import com.vgc.repository.UserRepository;
import com.vgc.service.CategoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    private final CategoryService categoryService;
    private final UserRepository userRepository;

    public CategoryController(CategoryService categoryService, UserRepository userRepository) {
        this.categoryService = categoryService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<CategoryResponse> getCategories() {
        return categoryService.getAllCategories();
    }

    @PostMapping("/request")
    public ResponseEntity<CategoryRequestResponse> requestCategory(
            @RequestBody CategoryRequestDto dto,
            Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(categoryService.requestCategory(dto, user));
    }
}
