# 📄 Project Specification: Visual Grid Community (VGC)

## 1. 개요 (Overview)
본 프로젝트는 기존의 텍스트 리스트형 커뮤니티 구조를 탈피하여, 9분할 격자(Grid) 이미지를 메인 인터페이스로 사용하는 시각 중심 커뮤니티 플랫폼입니다. 인스타그램의 레이아웃과 기존 커뮤니티(게시판)의 깊이감을 결합한 형태입니다.

## 2. 핵심 컨셉 (Core Concept)
Visual Title: 게시글 제목 대신 썸네일(이미지 또는 생성된 타이틀 카드)이 격자 형태로 노출됩니다.

Category-based: 태그 방식이 아닌 정해진 카테고리(게시판) 기반 운영.

Hybrid Content: 썸네일을 클릭하면 상세 게시글(글, 사진, 영상, 링크, 댓글)로 연결됩니다.

## 3. 상세 요구사항 (Detailed Requirements)

### A. 메인 피드 및 탐색 (Main Feed & Discovery)
Grid Layout: 3x3 격자 형태의 9개 이미지 피드 제공.

Initial Page (Trend): 전체 카테고리 중 '좋아요' 및 '댓글' 수가 많은 트렌드 게시글 우선 노출.

Filtering & Sorting:
* 카테고리 필터: 유머 / 시사 / 강아지 / 고양이 (초기 세팅).
* 정렬 조건: 최신순 / 좋아요순 / 댓글순.

Recommendation: 사용자의 활동 데이터에 기반한 개인화된 추천 알고리즘 적용 (9개 격자 구성 시 반영).

### B. 게시글 작성 및 표시 (Content Creation)
Title Card Generation:
* 이미지 첨부 시: 첫 번째 이미지를 썸네일로 사용.
* 이미지 미첨부 시: 입력한 제목 텍스트를 격자용 이미지(타이틀 카드)로 자동 생성 (Background Color + Text).

Editor: 본문 내 사진, 동영상, 외부 링크 삽입 지원.

Category Request:
* 원하는 게시판이 없을 경우 '생성 요청' 기능.
* 관리자(Admin) 승인 후 실제 카테고리로 활성화.

### C. 상세 페이지 및 인터랙션 (Interaction)
Post View: 일반적인 커뮤니티 게시글 형태 (본문 + 댓글 시스템).

User Action: 좋아요, 댓글 작성, 북마크(저장하기).

### D. 회원 기능 (User System)
Auth: 회원가입 및 로그인 기능.

My Page:
* 내가 작성한 글 목록.
* 내가 읽은(최근 본) 글 목록.
* 북마크한 글 모음.

### E. 반응형 레이아웃 (Responsive Grid UI)
Desktop (1024px 이상): 한 줄에 3개씩, 총 3줄(3x3)을 기본 단위로 하는 그리드 노출.

Tablet (768px ~ 1023px): 한 줄에 2개 또는 3개 유지 (화면 폭에 따라 최적화).

Mobile (767px 이하): 한 줄에 2개 또는 3개 선택 가능하도록 설계하되, 인스타그램 모바일 웹처럼 꽉 찬 3열 그리드를 기본으로 함.

Aspect Ratio: 모든 격자 아이템은 1:1 정정사각형(Square) 비율을 유지하며, 이미지가 박스에 꽉 차도록 object-fit: cover 속성 적용.

### F. 무한 스크롤 및 피드 동작 (Infinite Scroll & Feed Behavior)
Scrolling Experience: 사용자가 페이지 하단에 도달하기 전(약 80% 지점), 다음 9개(또는 정해진 단위)의 게시글을 백그라운드에서 미리 로드.

Loading State: 다음 데이터를 불러올 때 하단에 심플한 로딩 스피너(Spinner) 또는 스켈레톤 UI(Skeleton UI) 노출.

Back to Feed: 상세 페이지에서 '뒤로 가기'를 눌렀을 때, 이전에 보던 스크롤 위치를 기억하여 즉시 복구(Scroll Restoration).

### G. 타이틀 카드 생성 로직 (Placeholder Logic)
No-Image fallback: 사진이 없는 게시글의 경우, 아래 규칙에 따라 동적 이미지 생성.
* 배경: 카테고리별 고유 색상 또는 랜덤 파스텔톤 배경.
* 텍스트: 제목의 앞부분 15~20자 내외를 중앙에 배치 (반응형 폰트 크기 적용).
* 효과: CSS Grid와 Flexbox를 활용해 텍스트가 항상 정사각형 중앙에 오도록 처리.

## 4. 기술 스택 제안 (Technical Stack Suggestion)
Frontend: React.js 또는 Next.js (SEO 및 빠른 렌더링).

Backend: Spring Boot 또는 Node.js (Express).

Database: MySQL.

Storage: local

Image Processing: Canvas API 또는 외부 라이브러리 (텍스트-이미지 변환용).

## 5. 관리자 기능 (Admin Features)
카테고리 생성 요청 목록 조회 및 승인/거절.

신고 게시글 및 댓글 관리.

---

## 🛠 확정 기술 스택 (Confirmed Technical Stack)
* **Backend:** Spring Boot (Java, **Gradle** 기반)
* **Frontend:** Next.js (App Router)
* **Database:** **MySQL**