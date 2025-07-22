# ✈️ TripHub [ 여행 계획 추천 플랫폼 ]

여행지 정보를 기반으로 일정을 구성하고, 다른 사람의 여행 일정도 참고할 수 있는 여행 추천 플랫폼입니다.
GPT 기반 챗봇을 통해 조건에 맞는 여행지를 추천받고, 여행지와 게시글을 연결하여 직접 일정을 구성할 수 있습니다.

## 📅 개발 기간

2025.07.15 ~ 2025.07.22

## 🔗 배포 링크

👉 [TripHub (VerCel 배포)](https://aibe-3-project1-team04.vercel.app/)

---

## 📖 프로젝트 개요

- **여행지**와 **게시글(일정)**을 분리해 관리
- **게시글**은 여러 여행지로 구성된 일정 공유 목적
- 여행지와 게시글은 모두 피드(Feed) 형태로 목록 제공
- 사용자는 리뷰/별점/좋아요/즐겨찾기를 통해 선호를 표현할 수 있음
- 향후 추천 알고리즘 기반 기능 확장 예정

## ✨ 주요 기능

### 공통

- 검색, 필터, 정렬 기능 (비용, 지역, 별점, 카테고리 등)
- 로그인 없이 피드/상세 조회 가능
- 로그인 후 좋아요/즐겨찾기/작성 기능 가능

### 여행지

- 이름, 지역, 비용, 방문시간, 메모, 카테고리 입력
- 이미지 업로드 (최대 6장)
- 썸네일 이미지 선택
- 리뷰(댓글 + 별점), 좋아요, 즐겨찾기 기능

### 게시글

- 제목/내용 입력
- 여행지 등록 및 순서 구성
- 일정 탭 / 본문 탭 UI 분리
- 활동 요약: 총 비용, 활동 수, 지역 등
- 게시글 단위 리뷰/좋아요/조회수 기록

### 마이페이지

- 내가 작성한 여행지 / 게시글 목록
- 각 항목 수정/삭제 기능

## 📂 프로젝트 구조

```
AIBE3-Project1-Team04/
├── App/
```

## ⚙️ 기술 스택

| 항목       | 기술                                     |
| ---------- | ---------------------------------------- |
| 프론트엔드 | Next.js, Tailwind CSS, shadcn/ui         |
| 상태관리   | Context API, Zustand                     |
| 백엔드     | Supabase (auth, DB, storage), PostgreSQL|
| AI UI 도구 | Readdy.ai, Cursor                        |
| 배포       | Vercel (CI/CD 자동 배포)                 |
| 협업       | GitHub (GitHub Flow 전략), Notion, Slack |

## 🧩 ERD

<img width="2023" height="1285" alt="ERD Dialog" src="https://github.com/user-attachments/assets/15fd3ee1-1013-4235-b004-6059cc2ce232" />


👉[ERD 보러가기](https://www.erdcloud.com/d/JPNZrTTS5buYdTdSr/)

- 여행지(`places`)와 게시글(`posts`)은 1:N 관계
- 리뷰, 좋아요, 즐겨찾기, 조회수 각각 분리 테이블
- `auth.users`와 `users` 테이블 분리 사용 (확장 정보 저장용)

## 🏗 시스템 아키텍처

- 개발 & 배포
<img width="501" height="1385" alt="image" src="https://github.com/user-attachments/assets/6c68aeca-2601-4bdf-aadc-d141eecd645d" />

- 서비스 구성
<img width="1424" height="1258" alt="image" src="https://github.com/user-attachments/assets/8dc9a13d-5b24-4303-b5e3-28803b8bfadf" />

---

## 🤝 팀 협업 방식

> GitHub Flow 전략

1. 이슈 생성
2. 브랜치 생성 (`규칙 준수`)
3. 기능 개발
4. PR 작성 (PR 템플릿 기반)
5. 코드 리뷰 및 승인
6. `main` 브랜치로 merge → Vercel 자동 배포

## 📌 개발 현황 및 이슈

- [x] ERD 초안 완료
- [x] UI 초기 생성 (v0.dev, Readdy 기반)
- [x] 이슈 템플릿 / PR 템플릿 정리
- [x] README 초안 작성
- [x] 임시 회원가입 / 로그인 페이지 개발
- [x] AI 기반 UI 생성 도구 활용 초기 UI 개발

## 🔄 향후 개선 계획
- 

## 🧑‍💻 팀원 및 담당 역할

| 이름   | 역할             | GitHub                                 |
| ------ | ---------------- | -------------------------------------- |
| 김동엽 | AIBE3기 I들 멤버 | [@Yoepee](https://github.com/Yoepee)   |
| 김희수 | AIBE3기 I들 멤버 | [@inti0](https://github.com/inti0)     |
| 안지협 | AIBE3기 I들 멤버 | [@TooTo3](https://github.com/TooTo3)   |
| 장근영 | AIBE3기 I들 멤버 | [@geun-00](https://github.com/geun-00) |
| 정다솔 | AIBE3기 I들 멤버 | [@dbjoung](https://github.com/dbjoung) |
| 이록은 | AIBE3기 I들 멤버 | [@Leere1](https://github.com/Leere1)   |

---

## 💻 로컬 실행 방법

```bash
git clone https://github.com/prgrms-aibe-devcourse/AIBE3-Project1-Team04.git
cd AIBE3-Project1-Team04
npm install
npm run dev
```

## 🔗 참고자료 및 관련 링크

- [Gitmoji](https://gitmoji.dev/)
- [Tailwind CSS Cheat Sheet](https://kombai.com/tailwind/cheat-sheet/)
