package com.vgc.dto;

import com.vgc.entity.Post;
import java.time.LocalDateTime;

public class PostResponse {
    private Long id;
    private String title;
    private String content;
    private String imageUrl;
    private String category;
    private int likeCount;
    private int viewCount;
    private LocalDateTime createdAt;
    private int commentCount;

    public static PostResponse from(Post post, int commentCount) {
        PostResponse response = new PostResponse();
        response.id = post.getId();
        response.title = post.getTitle();
        response.content = post.getContent();
        response.imageUrl = post.getImageUrl();
        response.category = post.getCategory().name();
        response.likeCount = post.getLikeCount();
        response.viewCount = post.getViewCount();
        response.createdAt = post.getCreatedAt();
        response.commentCount = commentCount;
        return response;
    }

    // All getters
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getContent() { return content; }
    public String getImageUrl() { return imageUrl; }
    public String getCategory() { return category; }
    public int getLikeCount() { return likeCount; }
    public int getViewCount() { return viewCount; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public int getCommentCount() { return commentCount; }
}
