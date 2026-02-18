package com.vgc.controller;

import com.vgc.dto.PostRequest;
import com.vgc.dto.PostResponse;
import com.vgc.entity.User;
import com.vgc.repository.UserRepository;
import com.vgc.service.PostService;
import org.springframework.data.domain.Page;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/posts")
public class PostController {
    private final PostService postService;
    private final UserRepository userRepository;

    public PostController(PostService postService, UserRepository userRepository) {
        this.postService = postService;
        this.userRepository = userRepository;
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
            @RequestParam(value = "image", required = false) MultipartFile image,
            Authentication authentication) throws Exception {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        PostRequest request = new PostRequest();
        request.setTitle(title);
        request.setContent(content);
        request.setCategory(category);
        return postService.createPost(request, image, user);
    }

    @GetMapping("/{id}/like")
    public Map<String, Boolean> getLikeStatus(@PathVariable Long id, Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        boolean liked = postService.isLiked(user.getId(), id);
        return Map.of("liked", liked);
    }

    @PostMapping("/{id}/like")
    public PostResponse toggleLike(@PathVariable Long id, Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return postService.toggleLike(id, user);
    }
}
