## Step 1: PostContent 컴포넌트 생성

**새 파일: `frontend/src/components/PostContent.tsx`**

- `content` string을 받아 줄 단위로 분리
- 각 줄에서 URL 패턴 감지 (정규식: `https?://...`)
- YouTube URL 판별: `youtube.com/watch?v=ID` 또는 `youtu.be/ID`
    - 매치하면 `<iframe>` 임베드 렌더링 (`https://www.youtube.com/embed/{videoId}`)
    - 16:9 비율, 반응형 (aspect-ratio)
- 일반 URL → `<a href="..." target="_blank" rel="noopener noreferrer">` 클릭 가능 링크
- 나머지 텍스트는 기존처럼 plain text 유지
- XSS 방지: URL만 href에 넣고, 사용자 텍스트는 React children으로 렌더 (dangerouslySetInnerHTML 사용 안 함)

## Step 2: PostDetail에 PostContent 적용

**수정 파일: `frontend/src/components/PostDetail.tsx`**

기존:
```jsx
<div className="prose max-w-none whitespace-pre-wrap text-gray-800 leading-relaxed">
  {post.content}
</div>
```

변경:
```jsx
<PostContent content={post.content} />
```

---

## 수정 파일 요약

| 파일 | 작업 |
|------|------|
| `frontend/src/components/PostContent.tsx` | **새 파일** — URL 파싱 & YouTube 임베드 렌더링 컴포넌트 |
| `frontend/src/components/PostDetail.tsx` | `PostContent` 컴포넌트로 교체 |

백엔드 변경 없음.

## 검증 방법
1. 게시글에 `https://www.youtube.com/watch?v=dQw4w9WgXcQ` 입력 → 임베드 플레이어 표시 & 재생 가능
2. `https://youtu.be/dQw4w9WgXcQ` 단축 URL도 동일하게 임베드
3. `https://google.com` 같은 일반 URL → 파란색 클릭 가능 링크 (새 탭 열기)
4. URL 없는 일반 텍스트 → 기존처럼 표시
5. 한 줄에 텍스트 + URL 혼합 → 텍스트는 텍스트로, URL은 링크로 표시