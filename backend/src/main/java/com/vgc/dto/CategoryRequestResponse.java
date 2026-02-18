package com.vgc.dto;

import com.vgc.entity.CategoryRequest;
import java.time.LocalDateTime;

public class CategoryRequestResponse {
    private Long id;
    private String name;
    private String label;
    private String color;
    private String status;
    private String requesterNickname;
    private String rejectionReason;
    private LocalDateTime createdAt;

    public static CategoryRequestResponse from(CategoryRequest request) {
        CategoryRequestResponse response = new CategoryRequestResponse();
        response.id = request.getId();
        response.name = request.getName();
        response.label = request.getLabel();
        response.color = request.getColor();
        response.status = request.getStatus();
        response.requesterNickname = request.getRequester() != null ? request.getRequester().getNickname() : null;
        response.rejectionReason = request.getRejectionReason();
        response.createdAt = request.getCreatedAt();
        return response;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getLabel() { return label; }
    public String getColor() { return color; }
    public String getStatus() { return status; }
    public String getRequesterNickname() { return requesterNickname; }
    public String getRejectionReason() { return rejectionReason; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
