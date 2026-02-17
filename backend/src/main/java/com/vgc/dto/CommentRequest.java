package com.vgc.dto;

public class CommentRequest {
    private String content;
    private String authorName;

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public String getAuthorName() { return authorName; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }
}
