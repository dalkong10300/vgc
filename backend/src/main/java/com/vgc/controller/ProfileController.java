package com.vgc.controller;

import com.vgc.dto.PostResponse;
import com.vgc.entity.User;
import com.vgc.repository.CommentRepository;
import com.vgc.repository.PostRepository;
import com.vgc.repository.UserRepository;
import com.vgc.service.BookmarkService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final BookmarkService bookmarkService;

    public ProfileController(PostRepository postRepository, CommentRepository commentRepository,
                             UserRepository userRepository, BookmarkService bookmarkService) {
        this.postRepository = postRepository;
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
        this.bookmarkService = bookmarkService;
    }

    @GetMapping("/posts")
    public Page<PostResponse> getMyPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return postRepository.findByAuthorIdOrderByCreatedAtDesc(user.getId(), PageRequest.of(page, size))
                .map(post -> {
                    PostResponse response = PostResponse.from(post, commentRepository.countByPostId(post.getId()));
                    response.setBookmarked(bookmarkService.isBookmarked(user.getId(), post.getId()));
                    return response;
                });
    }

    @GetMapping("/bookmarks")
    public Page<PostResponse> getMyBookmarks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return bookmarkService.getBookmarkedPosts(user.getId(), PageRequest.of(page, size));
    }
}
