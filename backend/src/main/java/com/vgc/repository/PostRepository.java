package com.vgc.repository;

import com.vgc.entity.Category;
import com.vgc.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post, Long> {
    Page<Post> findByCategory(Category category, Pageable pageable);
}
