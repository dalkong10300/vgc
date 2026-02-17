package com.vgc.controller;

import com.vgc.dto.CommentRequest;
import com.vgc.entity.Comment;
import com.vgc.service.CommentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts/{postId}/comments")
public class CommentController {
    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @GetMapping
    public List<Comment> getComments(@PathVariable Long postId) {
        return commentService.getComments(postId);
    }

    @PostMapping
    public Comment addComment(@PathVariable Long postId, @RequestBody CommentRequest request) {
        return commentService.addComment(postId, request);
    }
}
