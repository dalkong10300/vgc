package com.vgc.controller;

import com.vgc.entity.User;
import com.vgc.repository.UserRepository;
import com.vgc.service.BookmarkService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/posts")
public class BookmarkController {
    private final BookmarkService bookmarkService;
    private final UserRepository userRepository;

    public BookmarkController(BookmarkService bookmarkService, UserRepository userRepository) {
        this.bookmarkService = bookmarkService;
        this.userRepository = userRepository;
    }

    @PostMapping("/{postId}/bookmark")
    public Map<String, Boolean> toggleBookmark(@PathVariable Long postId, Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        boolean bookmarked = bookmarkService.toggleBookmark(user, postId);
        return Map.of("bookmarked", bookmarked);
    }

    @GetMapping("/{postId}/bookmark")
    public Map<String, Boolean> getBookmarkStatus(@PathVariable Long postId, Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        boolean bookmarked = bookmarkService.isBookmarked(user.getId(), postId);
        return Map.of("bookmarked", bookmarked);
    }
}
