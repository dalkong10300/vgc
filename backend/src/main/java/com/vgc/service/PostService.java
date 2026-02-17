package com.vgc.service;

import com.vgc.dto.PostRequest;
import com.vgc.dto.PostResponse;
import com.vgc.entity.Category;
import com.vgc.entity.Post;
import com.vgc.repository.CommentRepository;
import com.vgc.repository.PostRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class PostService {
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    public PostService(PostRepository postRepository, CommentRepository commentRepository) {
        this.postRepository = postRepository;
        this.commentRepository = commentRepository;
    }

    public Page<PostResponse> getAllPosts(String category, String sort, int page, int size) {
        Sort sortOrder = switch (sort) {
            case "popular" -> Sort.by(Sort.Direction.DESC, "likeCount");
            case "views" -> Sort.by(Sort.Direction.DESC, "viewCount");
            default -> Sort.by(Sort.Direction.DESC, "createdAt");
        };

        PageRequest pageRequest = PageRequest.of(page, size, sortOrder);

        Page<Post> posts;
        if (category != null && !category.isEmpty()) {
            posts = postRepository.findByCategory(Category.valueOf(category), pageRequest);
        } else {
            posts = postRepository.findAll(pageRequest);
        }

        return posts.map(post -> PostResponse.from(post, commentRepository.countByPostId(post.getId())));
    }

    public PostResponse getPost(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        post.setViewCount(post.getViewCount() + 1);
        postRepository.save(post);
        return PostResponse.from(post, commentRepository.countByPostId(post.getId()));
    }

    public PostResponse createPost(PostRequest request, MultipartFile image) throws IOException {
        Post post = new Post();
        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setCategory(Category.valueOf(request.getCategory()));

        if (image != null && !image.isEmpty()) {
            String fileName = UUID.randomUUID() + "_" + image.getOriginalFilename();
            Path uploadPath = Paths.get(uploadDir);
            Files.createDirectories(uploadPath);
            Files.copy(image.getInputStream(), uploadPath.resolve(fileName));
            post.setImageUrl("/uploads/" + fileName);
        }

        Post saved = postRepository.save(post);
        return PostResponse.from(saved, 0);
    }

    public PostResponse toggleLike(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        post.setLikeCount(post.getLikeCount() + 1);
        postRepository.save(post);
        return PostResponse.from(post, commentRepository.countByPostId(post.getId()));
    }
}
