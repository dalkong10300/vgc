- 로그인 성공 시 토큰 저장 후 메인으로 이동
- 회원가입 페이지 링크

**새 파일: `frontend/src/app/register/page.tsx`**
- 이메일, 비밀번호, 닉네임 입력 폼
- 회원가입 성공 시 자동 로그인 후 메인으로 이동

## Step 7: 프론트엔드 — 기존 컴포넌트 수정

**`Header.tsx`**
- 로그인 상태: 닉네임 표시 + 로그아웃 버튼
- 비로그인 상태: 로그인 버튼 표시
- "새 글 쓰기"는 로그인 시에만 표시

**`CommentSection.tsx`**
- authorName 입력 필드 제거
- 로그인 시: 닉네임 자동 표시 + 댓글 작성 가능
- 비로그인 시: "로그인 후 댓글을 작성할 수 있습니다" 메시지

**`frontend/src/app/posts/new/page.tsx`**
- 비로그인 시 로그인 페이지로 리다이렉트

**`frontend/src/types/index.ts`**
- User 타입 추가
- Post에 authorNickname 필드 추가

---

## 수정 파일 요약

### 백엔드 새 파일 (8개)
- `entity/User.java`
- `repository/UserRepository.java`
- `security/JwtUtil.java`
- `security/JwtAuthenticationFilter.java`
- `config/SecurityConfig.java`
- `dto/AuthRequest.java`, `dto/AuthResponse.java`
- `service/AuthService.java`
- `controller/AuthController.java`

### 백엔드 수정 파일 (8개)
- `build.gradle` — 의존성 추가
- `application.properties` — jwt.secret 추가
- `entity/Post.java` — author 필드
- `entity/Comment.java` — author 필드
- `dto/PostResponse.java` — authorNickname
- `service/PostService.java` — User 파라미터
- `controller/PostController.java` — 인증 사용자
- `controller/CommentController.java` — 인증 사용자
- `config/WebConfig.java` — SecurityConfig와 통합

### 프론트엔드 새 파일 (4개)
- `lib/auth.ts`
- `context/AuthContext.tsx`
- `app/login/page.tsx`
- `app/register/page.tsx`

### 프론트엔드 수정 파일 (6개)
- `lib/api.ts` — 인증 헤더
- `types/index.ts` — User 타입
- `app/layout.tsx` — AuthProvider
- `components/Header.tsx` — 로그인 UI
- `components/CommentSection.tsx` — 자동 닉네임
- `app/posts/new/page.tsx` — 로그인 체크

## 검증 방법
1. 회원가입 → 로그인 → JWT 토큰 발급 확인
2. 로그인 상태에서 게시글 작성 → 작성자 자동 설정 확인
3. 비로그인 상태에서 POST 요청 → 401 응답 확인
4. 로그인 상태에서 댓글 작성 → 닉네임 자동 설정 확인
5. 새로고침 후 로그인 상태 유지 확인 (localStorage)
6. 로그아웃 → 헤더 UI 변경 확인