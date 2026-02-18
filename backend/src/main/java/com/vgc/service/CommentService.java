package com.vgc.service;

import com.vgc.dto.CommentRequest;
import com.vgc.entity.Comment;
import com.vgc.entity.Post;
import com.vgc.entity.User;
import com.vgc.repository.CommentRepository;
import com.vgc.repository.PostRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CommentService {
    private final CommentRepository commentRepository;
    private final PostRepository postRepository;

    public CommentService(CommentRepository commentRepository, PostRepository postRepository) {
        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
    }

    public List<Comment> getComments(Long postId) {
        return commentRepository.findByPostIdOrderByCreatedAtDesc(postId);
    }

    @Transactional
    public Comment addComment(Long postId, CommentRequest request, User author) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        Comment comment = new Comment();
        comment.setPost(post);
        comment.setContent(request.getContent());
        comment.setAuthorName(author.getNickname());
        comment.setAuthor(author);
        return commentRepository.save(comment);
    }
}
