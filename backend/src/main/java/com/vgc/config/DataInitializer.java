package com.vgc.config;

import com.vgc.entity.Category;
import com.vgc.repository.CategoryRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    private final CategoryRepository categoryRepository;

    public DataInitializer(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public void run(String... args) {
        if (categoryRepository.count() == 0) {
            categoryRepository.save(new Category("HUMOR", "유머", "yellow"));
            categoryRepository.save(new Category("NEWS", "시사", "blue"));
            categoryRepository.save(new Category("DOG", "강아지", "orange"));
            categoryRepository.save(new Category("CAT", "고양이", "purple"));
            categoryRepository.save(new Category("CHAT", "잡담", "green"));
        }
    }
}
