package com.vgc.controller;

import com.vgc.dto.PostRequest;
import com.vgc.dto.PostResponse;
import com.vgc.service.PostService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/posts")
public class PostController {
    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @GetMapping
    public Page<PostResponse> getPosts(
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "latest") String sort,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "9") int size) {
        return postService.getAllPosts(category, sort, page, size);
    }

    @GetMapping("/{id}")
    public PostResponse getPost(@PathVariable Long id) {
        return postService.getPost(id);
    }

    @PostMapping
    public PostResponse createPost(
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam("category") String category,
            @RequestParam(value = "image", required = false) MultipartFile image) throws Exception {
        PostRequest request = new PostRequest();
        request.setTitle(title);
        request.setContent(content);
        request.setCategory(category);
        return postService.createPost(request, image);
    }

    @PostMapping("/{id}/like")
    public PostResponse toggleLike(@PathVariable Long id) {
        return postService.toggleLike(id);
    }
}
