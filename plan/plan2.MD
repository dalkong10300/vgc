- `/api/profile/**` 인증 필요 추가
- `POST /api/posts/*/bookmark` 인증 필요 추가

**기존 파일 수정: `backend/.../dto/PostResponse.java`**
- `bookmarked` 필드 추가 (boolean, 로그인 유저 기준)

## Step 3: 프론트엔드 — API & 타입 수정

**기존 파일 수정: `frontend/src/types/index.ts`**
- Post 인터페이스에 `bookmarked?: boolean` 추가

**기존 파일 수정: `frontend/src/lib/api.ts`**
- `toggleBookmark(postId)`: POST /api/posts/{postId}/bookmark
- `getBookmarkStatus(postId)`: GET /api/posts/{postId}/bookmark
- `getMyPosts(page, size)`: GET /api/profile/posts
- `getMyBookmarks(page, size)`: GET /api/profile/bookmarks

## Step 4: 프론트엔드 — 북마크 버튼 추가

**기존 파일 수정: `frontend/src/components/PostDetail.tsx`**
- 좋아요 버튼 옆에 북마크 버튼 추가 (🔖 아이콘)
- 로그인 시에만 표시, 클릭 시 토글

**기존 파일 수정: `frontend/src/components/GridItem.tsx`**
- 그리드 아이템 hover 시 북마크 아이콘 표시 (우상단)
- 클릭 시 토글 (Link 이동 방지 필요)

## Step 5: 프론트엔드 — 프로필 페이지

**새 파일: `frontend/src/app/profile/page.tsx`**
- 비로그인 시 /login으로 리다이렉트
- 상단: 닉네임 표시
- 2개 탭: "내가 쓴 글" / "북마크"
- 각 탭: 기존 GridFeed와 동일한 3열 그리드 레이아웃
- 페이지네이션 (무한 스크롤 또는 더보기 버튼)

**기존 파일 수정: `frontend/src/components/Header.tsx`**
- 닉네임 클릭 시 /profile로 이동 (Link 추가)

---

## 수정 파일 요약

### 백엔드 새 파일 (4개)
- `entity/Bookmark.java`
- `repository/BookmarkRepository.java`
- `service/BookmarkService.java`
- `controller/BookmarkController.java`
- `controller/ProfileController.java`

### 백엔드 수정 파일 (3개)
- `repository/PostRepository.java` — findByAuthorId 추가
- `config/SecurityConfig.java` — 새 경로 인증 설정
- `dto/PostResponse.java` — bookmarked 필드

### 프론트엔드 새 파일 (1개)
- `app/profile/page.tsx`

### 프론트엔드 수정 파일 (5개)
- `types/index.ts` — bookmarked 필드
- `lib/api.ts` — 북마크/프로필 API
- `components/PostDetail.tsx` — 북마크 버튼
- `components/GridItem.tsx` — 북마크 아이콘
- `components/Header.tsx` — 닉네임 링크

## 검증 방법
1. 로그인 → 게시글 상세에서 북마크 토글 → 아이콘 상태 변경 확인
2. 그리드에서 북마크 아이콘 클릭 → 게시글 이동 없이 북마크 토글 확인
3. /profile 접속 → "내가 쓴 글" 탭에 본인 게시글만 표시 확인
4. /profile → "북마크" 탭에 북마크한 글 표시 확인
5. 비로그인 상태에서 /profile 접속 → /login 리다이렉트 확인
6. 헤더 닉네임 클릭 → /profile 이동 확인

: