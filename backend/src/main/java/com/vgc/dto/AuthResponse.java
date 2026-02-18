package com.vgc.dto;

public class AuthResponse {
    private String token;
    private String nickname;
    private String role;

    public AuthResponse(String token, String nickname, String role) {
        this.token = token;
        this.nickname = nickname;
        this.role = role;
    }

    public String getToken() { return token; }
    public String getNickname() { return nickname; }
    public String getRole() { return role; }
}
