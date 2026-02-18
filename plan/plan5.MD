# 카테고리 동적 관리 시스템 — enum → DB 마이그레이션 + 카테고리 요청/승인

## Context
현재 카테고리가 백엔드 Java enum + 프론트 4곳에 하드코딩되어 있어 게시판 추가 시 코드 수정 + 양쪽 재배포 필요.
카테고리를 DB 테이블로 전환하고, 유저가 새 카테고리를 요청하면 관리자가 승인/거절하는 시스템을 구축한다.

## 현재 상태
- Category: Java enum (`HUMOR, NEWS, DOG, CAT, CHAT`)
- Post.category: `@Enumerated(EnumType.STRING)` → DB에 VARCHAR로 저장됨
- User: role 필드 없음, 관리자 개념 없음
- 프론트: Category enum + 하드코딩 배열 4곳

---

## Step 1: 백엔드 — Entity 변경

### 1-1. Category enum → JPA Entity로 교체
**파일: `backend/.../entity/Category.java`** (전체 교체)
- 필드: `id`, `name`(HUMOR 등 unique), `label`(유머 등), `color`(yellow 등), `createdAt`

### 1-2. User에 role 필드 추가
**파일: `backend/.../entity/User.java`**
- `private String role = "USER"` 추가 (nullable 허용, Java 기본값으로 커버)

### 1-3. Post.category를 String으로 변경
**파일: `backend/.../entity/Post.java`**
- `@Enumerated(EnumType.STRING) Category category` → `String category`
- 기존 DB 데이터는 이미 VARCHAR이므로 마이그레이션 불필요

### 1-4. CategoryRequest Entity 생성
**새 파일: `backend/.../entity/CategoryRequest.java`**
- 필드: `id`, `name`, `label`, `color`, `status`(PENDING/APPROVED/REJECTED), `requester`(User FK), `rejectionReason`, `createdAt`

## Step 2: 백엔드 — Repository

- **새 파일**: `CategoryRepository.java` — `findByName`, `existsByName`
- **새 파일**: `CategoryRequestRepository.java` — `findByStatus`, `findByRequesterId`
- **수정**: `PostRepository.java` — `findByCategory(Category)` → `findByCategory(String)`

## Step 3: 백엔드 — DTO

- **새 파일**: `CategoryResponse.java` (id, name, label, color)
- **새 파일**: `CategoryRequestDto.java` (name, label, color — 요청 입력)
- **새 파일**: `CategoryRequestResponse.java` (id, name, label, color, status, requesterNickname, rejectionReason, createdAt)
- **수정**: `AuthResponse.java` — `role` 필드 추가
- **수정**: `PostResponse.java` — `post.getCategory().name()` → `post.getCategory()` (이미 String)

## Step 4: 백엔드 — Service

### 4-1. CategoryService (새 파일)
- `getAllCategories()` — 전체 카테고리 목록
- `requestCategory(dto, user)` — 카테고리 요청 생성 (중복 체크)
- `approveRequest(id)` — 승인 → Category 테이블에 행 추가
- `rejectRequest(id, reason)` — 거절

### 4-2. PostService 수정
- `Category.valueOf()` 제거 → String으로 받아서 `categoryRepository.existsByName()` 검증

### 4-3. AuthService 수정
- login/register 응답에 `role` 포함

## Step 5: 백엔드 — Controller & Security

### 5-1. CategoryController (새 파일)
- `GET /api/categories` — 공개, 전체 카테고리 목록
- `POST /api/categories/request` — 인증 필요, 카테고리 요청

### 5-2. AdminController (새 파일)
- `GET /api/admin/category-requests` — 대기 중 요청 목록
- `POST /api/admin/category-requests/{id}/approve` — 승인
- `POST /api/admin/category-requests/{id}/reject` — 거절
- 각 메서드에서 `user.getRole().equals("ADMIN")` 확인 (간단한 방식)

### 5-3. SecurityConfig 수정
- `GET /api/categories` → permitAll
- `POST /api/categories/request` → authenticated
- `/api/admin/**` → authenticated (role 체크는 컨트롤러에서)

## Step 6: 백엔드 — 초기 데이터 시딩

**새 파일: `backend/.../config/DataInitializer.java`**
- 앱 시작 시 categories 테이블이 비어있으면 기존 5개(HUMOR, NEWS, DOG, CAT, CHAT) 자동 삽입
- 기존 posts 데이터는 이미 같은 VARCHAR 값이므로 별도 마이그레이션 불필요

## Step 7: 프론트엔드 — 타입 & 인증

### 7-1. types/index.ts
- `Category` enum 삭제 → `CategoryInfo` 인터페이스 추가 (`id, name, label, color`)
- `Post.category` 타입을 `string`으로 변경

### 7-2. lib/auth.ts
- `role` 저장/조회/삭제 추가

### 7-3. AuthContext.tsx
- `role`, `isAdmin` 추가

## Step 8: 프론트엔드 — API 함수 추가

**파일: `lib/api.ts`**
- `getCategories()` — `GET /api/categories`
- `requestCategory(data)` — `POST /api/categories/request`
- `getPendingCategoryRequests()` — `GET /api/admin/category-requests`
- `approveCategoryRequest(id)` — `POST /api/admin/category-requests/{id}/approve`
- `rejectCategoryRequest(id, reason)` — `POST /api/admin/category-requests/{id}/reject`

## Step 9: 프론트엔드 — 카테고리 하드코딩 제거

### 9-1. CategoryFilter.tsx
- 하드코딩 배열 삭제 → `getCategories()` API로 동적 로딩

### 9-2. PostDetail.tsx
- `categoryLabel`, `categoryColor` Record 삭제 → API에서 받은 카테고리 정보로 동적 렌더링
- `color` 문자열 → Tailwind 클래스 매핑 유틸리티

### 9-3. posts/new/page.tsx
- 하드코딩 배열 삭제 → API에서 카테고리 목록 로딩

## Step 10: 프론트엔드 — 관리자 페이지 & UI

### 10-1. 관리자 페이지 (새 파일: `app/admin/page.tsx`)
- 대기 중 카테고리 요청 목록 표시
- 승인/거절 버튼
- `isAdmin` 체크, 아니면 홈으로 리다이렉트

### 10-2. Header.tsx 수정
- `isAdmin`이면 관리자 페이지 링크 표시

---
## 수정 파일 요약

| 작업 | 파일 |
|------|------|
| 교체 | `backend/.../entity/Category.java` |
| 수정 | `backend/.../entity/Post.java`, `User.java` |
| 생성 | `backend/.../entity/CategoryRequest.java` |
| 수정 | `backend/.../repository/PostRepository.java` |
| 생성 | `backend/.../repository/CategoryRepository.java`, `CategoryRequestRepository.java` |
| 수정 | `backend/.../dto/AuthResponse.java`, `PostResponse.java` |
| 생성 | `backend/.../dto/CategoryResponse.java`, `CategoryRequestDto.java`, `CategoryRequestResponse.java` |
| 수정 | `backend/.../service/PostService.java`, `AuthService.java` |
| 생성 | `backend/.../service/CategoryService.java` |
| 생성 | `backend/.../controller/CategoryController.java`, `AdminController.java` |
| 수정 | `backend/.../config/SecurityConfig.java` |
| 생성 | `backend/.../config/DataInitializer.java` |
| 수정 | `frontend/.../types/index.ts` |
| 수정 | `frontend/.../lib/auth.ts`, `api.ts` |
| 수정 | `frontend/.../context/AuthContext.tsx` |
| 수정 | `frontend/.../components/CategoryFilter.tsx`, `PostDetail.tsx`, `Header.tsx` |
| 수정 | `frontend/.../app/posts/new/page.tsx` |
| 생성 | `frontend/.../app/admin/page.tsx` |

## 데이터 마이그레이션
1. 백엔드 배포 → Hibernate가 `categories`, `category_requests` 테이블 자동 생성, `users`에 `role` 컬럼 추가
2. DataInitializer가 기존 5개 카테고리 자동 시딩
3. SQL 실행: `UPDATE users SET role = 'USER' WHERE role IS NULL;` + 관리자 계정 `UPDATE users SET role = 'ADMIN' WHERE email = '...';`
4. posts 테이블은 변경 없음 (이미 VARCHAR로 동일한 값 저장 중)

## 검증 방법
1. `GET /api/categories` → 5개 카테고리 반환 확인
2. 프론트에서 카테고리 필터/글쓰기 셀렉트가 API 기반으로 동작 확인
3. 일반 유저로 카테고리 요청 → PENDING 상태 확인
4. 관리자 계정으로 승인 → 새 카테고리가 즉시 목록에 반영 확인
5. 거절 시 사유 입력 → REJECTED 상태 확인
6. 기존 게시글이 정상 표시되는지 확인
