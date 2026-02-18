## Context
현재 좋아요(like)가 클릭할 때마다 `likeCount`가 1씩 무한 증가하는 구조이다.
북마크처럼 **유저별 토글**(좋아요 ↔ 취소)로 변경해야 한다.

### 현재 문제점
- `PostService.toggleLike()`: 단순히 `likeCount + 1` 후 저장 (토글 아님)
- `PostController.toggleLike()`: `Authentication` 파라미터 없음 (유저 추적 불가)
- Like 엔티티가 없어서 누가 좋아요했는지 기록하지 않음

---

## Step 1: 백엔드 — Like 엔티티 & Repository

**새 파일: `backend/src/main/java/com/vgc/entity/PostLike.java`**
- `id`(Long), `user`(@ManyToOne User), `post`(@ManyToOne Post), `createdAt`
- unique constraint: `(user_id, post_id)` 쌍
- Bookmark 엔티티와 동일한 패턴

**새 파일: `backend/src/main/java/com/vgc/repository/PostLikeRepository.java`**
- `boolean existsByUserIdAndPostId(Long userId, Long postId)`
- `void deleteByUserIdAndPostId(Long userId, Long postId)`
- `int countByPostId(Long postId)` — 게시글의 총 좋아요 수

## Step 2: 백엔드 — PostService 좋아요 토글 수정

**수정 파일: `backend/src/main/java/com/vgc/service/PostService.java`**
- `PostLikeRepository` 의존성 추가
- `toggleLike(Long id)` → `toggleLike(Long id, User user)`로 변경
    - `existsByUserIdAndPostId`로 확인
    - 있으면 삭제 + `likeCount - 1`
    - 없으면 추가 + `likeCount + 1`
    - `@Transactional` 추가

**수정 파일: `backend/src/main/java/com/vgc/controller/PostController.java`**
- `toggleLike` 메서드에 `Authentication` 파라미터 추가
- `userRepository.findByEmail()`로 User 조회 후 서비스에 전달

**수정 파일: `backend/src/main/java/com/vgc/dto/PostResponse.java`**
- `liked` 필드 추가 (boolean) + getter/setter

## Step 3: 프론트엔드 — 좋아요 상태 반영

**수정 파일: `frontend/src/types/index.ts`**
- Post 인터페이스에 `liked?: boolean` 추가

**수정 파일: `frontend/src/components/PostDetail.tsx`**
- 좋아요 버튼에 `liked` 상태 반영 (색상 변경: 활성=rose, 비활성=gray)
- 로그인 시에만 좋아요 가능

---

## 수정 파일 요약

### 백엔드 새 파일 (2개)
- `entity/PostLike.java`
- `repository/PostLikeRepository.java`

### 백엔드 수정 파일 (3개)
- `service/PostService.java` — toggleLike 로직 변경
- `controller/PostController.java` — Authentication 추가
- `dto/PostResponse.java` — liked 필드 추가

### 프론트엔드 수정 파일 (2개)
- `types/index.ts` — liked 필드 추가
- `components/PostDetail.tsx` — 좋아요 버튼 상태 UI

## 검증 방법
1. 로그인 → 게시글 좋아요 클릭 → likeCount +1, 버튼 활성화(rose)
2. 다시 클릭 → likeCount -1, 버튼 비활성화(gray)
3. 새로고침 후에도 좋아요 상태 유지 확인
4. 비로그인 시 좋아요 버튼 비활성 또는 미표시 확인