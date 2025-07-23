# ✈️ TripHub [ 여행 계획 추천 플랫폼 ]

여행지 정보를 기반으로 일정을 구성하고, 다른 사람의 여행 일정도 참고할 수 있는 여행 추천 플랫폼입니다.
GPT 기반 챗봇을 통해 조건에 맞는 여행지를 추천받고, 여행지와 게시글을 연결하여 직접 일정을 구성할 수 있습니다.

## 📅 개발 기간

2025.07.15 ~ 2025.07.22

## 🔗 배포 링크

👉 [TripHub (VerCel 배포)](https://aibe-3-project1-team04.vercel.app/)

---

## 📖 프로젝트 개요

TripHub는 단순한 장소 정보 중심의 추천을 넘어,  
**방문 시간, 체류 시간, 비용** 등 **구체적인 여행 데이터를 기반으로  
실질적인 일정 구성에 도움을 주는 여행 계획 추천 플랫폼**입니다.

사용자는 여행지와 여행 일정을 직접 등록하고,  
다른 사람의 여행 데이터를 참고해 **현실적인 계획을 세울 수 있으며**,  
GPT 기반 AI 챗봇을 통해 조건에 맞는 여행지를 추천받을 수 있습니다.

## ✨ 주요 기능

### 🧭 공통

- 여행지 및 게시글 **검색 / 필터 / 정렬** 기능  
  (비용, 지역, 별점, 카테고리 등 기준)
- **피드 형태**의 목록 제공 (여행지 / 게시글 모두)
- **로그인 없이도 피드 / 상세페이지 열람 가능**
- **로그인 시** 좋아요, 즐겨찾기, 작성 기능 사용 가능
- **GPT 기반 챗봇**을 통한 조건 기반 여행지 추천

### 📍 여행지

- 이름, 지역, 카테고리, 방문 시간, 체류 시간, 메모, 비용 입력
- 여행지 **이미지 업로드** (최대 6장), 썸네일 이미지 지정
- **리뷰(댓글 + 별점)** 작성 및 열람
- **좋아요 / 즐겨찾기 / 조회수** 기록
- 여행지 단독 등록 또는 게시글과 연결 가능
- 임시 저장 기능 지원

### 📝 게시글 (여행 일정)

- 제목 / 본문 입력, 여행지 목록 구성 및 순서 지정
- **일정 탭 / 본문 탭 UI 분리**
- 활동 요약 정보 표시  
  (총 비용, 활동 수, 방문 지역, 전체 체류 시간 등)
- 게시글 단위로 **좋아요 / 조회수 / 리뷰** 기록
- 임시 저장 기능 지원
- 게시글 링크 복사로 **외부 공유 가능**

### 🙋 마이페이지

- 내가 작성한 여행지 / 게시글 목록 조회
- 각 항목에 대해 **수정 / 삭제** 기능 제공
- 내가 누른 좋아요 / 즐겨찾기 항목 관리

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
| 백엔드     | Supabase (auth, DB, storage), PostgreSQL |
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

| 개발 & 배포                                                                                                                         | 서비스 구성                                                                                                                          |
| ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| <img width="501" height="1385" alt="image" src="https://github.com/user-attachments/assets/6c68aeca-2601-4bdf-aadc-d141eecd645d" /> | <img width="1424" height="1258" alt="image" src="https://github.com/user-attachments/assets/8dc9a13d-5b24-4303-b5e3-28803b8bfadf" /> |
|                                                                                                                                     |

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
