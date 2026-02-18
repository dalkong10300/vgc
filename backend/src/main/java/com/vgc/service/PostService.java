package com.vgc.service;

import com.vgc.dto.PostRequest;
import com.vgc.dto.PostResponse;
import com.vgc.entity.Post;
import com.vgc.entity.PostLike;
import com.vgc.entity.User;
import com.vgc.repository.CategoryRepository;
import com.vgc.repository.CommentRepository;
import com.vgc.repository.PostLikeRepository;
import com.vgc.repository.PostRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class PostService {
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final PostLikeRepository postLikeRepository;
    private final CategoryRepository categoryRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    public PostService(PostRepository postRepository, CommentRepository commentRepository, PostLikeRepository postLikeRepository, CategoryRepository categoryRepository) {
        this.postRepository = postRepository;
        this.commentRepository = commentRepository;
        this.postLikeRepository = postLikeRepository;
        this.categoryRepository = categoryRepository;
    }

    public Page<PostResponse> getAllPosts(String category, String sort, int page, int size) {
        Sort sortOrder = switch (sort) {
            case "popular" -> Sort.by(Sort.Direction.DESC, "likeCount");
            case "views" -> Sort.by(Sort.Direction.DESC, "viewCount");
            default -> Sort.by(Sort.Direction.DESC, "createdAt");
        };

        PageRequest pageRequest = PageRequest.of(page, size, sortOrder);

        Page<Post> posts;
        if (category != null && !category.isEmpty()) {
            posts = postRepository.findByCategory(category, pageRequest);
        } else {
            posts = postRepository.findAll(pageRequest);
        }

        return posts.map(post -> PostResponse.from(post, commentRepository.countByPostId(post.getId())));
    }

    public PostResponse getPost(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        post.setViewCount(post.getViewCount() + 1);
        postRepository.save(post);
        return PostResponse.from(post, commentRepository.countByPostId(post.getId()));
    }

    public PostResponse createPost(PostRequest request, MultipartFile image, User author) throws IOException {
        Post post = new Post();
        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        if (!categoryRepository.existsByName(request.getCategory())) {
            throw new RuntimeException("존재하지 않는 카테고리입니다.");
        }
        post.setCategory(request.getCategory());
        post.setAuthor(author);

        if (image != null && !image.isEmpty()) {
            String fileName = UUID.randomUUID() + "_" + image.getOriginalFilename();
            Path uploadPath = Paths.get(uploadDir);
            Files.createDirectories(uploadPath);
            Files.copy(image.getInputStream(), uploadPath.resolve(fileName));
            post.setImageUrl("/uploads/" + fileName);
        }

        Post saved = postRepository.save(post);
        return PostResponse.from(saved, 0);
    }

    @Transactional
    public PostResponse toggleLike(Long id, User user) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        boolean alreadyLiked = postLikeRepository.existsByUserIdAndPostId(user.getId(), post.getId());
        if (alreadyLiked) {
            postLikeRepository.deleteByUserIdAndPostId(user.getId(), post.getId());
            post.setLikeCount(Math.max(0, post.getLikeCount() - 1));
        } else {
            PostLike postLike = new PostLike();
            postLike.setUser(user);
            postLike.setPost(post);
            postLikeRepository.save(postLike);
            post.setLikeCount(post.getLikeCount() + 1);
        }

        postRepository.save(post);
        PostResponse response = PostResponse.from(post, commentRepository.countByPostId(post.getId()));
        response.setLiked(!alreadyLiked);
        return response;
    }

    public boolean isLiked(Long userId, Long postId) {
        return postLikeRepository.existsByUserIdAndPostId(userId, postId);
    }
}
