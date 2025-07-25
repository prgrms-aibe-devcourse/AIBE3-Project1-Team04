# ✈️ TripHub [ 여행 계획 추천 플랫폼 ]

여행지 정보를 기반으로 일정을 구성하고, 다른 사람의 여행 일정도 참고할 수 있는 여행 추천 플랫폼입니다.
GPT 기반 챗봇을 통해 조건에 맞는 여행지를 추천받고, 여행지와 게시글을 연결하여 직접 일정을 구성할 수 있습니다.

## 📅 개발 기간

2025.07.15 ~ 2025.07.22

## 🔗 배포 링크

👉 [TripHub (VerCel 배포)](https://aibe-3-project1-team04.vercel.app/)

## 📄 프로젝트 발표자료

👉 [TripHub 발표자료 보러가기 (PDF)](./docs/TripHub_Presentation.pdf)

## 🏆 프로젝트 성과

- AIBE3 1회차 팀 프로젝트 평가에서 **TripHub 팀이 전체 1위 선정**
- 모든 팀이 **자기 팀을 제외하고 투표**한 결과, **완성도/기획/발표력** 모두 높은 평가를 받음

## 📖 프로젝트 개요

TripHub는 단순한 장소 정보 중심의 추천을 넘어,  
**방문 시간, 체류 시간, 비용** 등 **구체적인 여행 데이터를 기반으로  
실질적인 일정 구성에 도움을 주는 여행 계획 추천 플랫폼**입니다.

사용자는 여행지와 여행 일정을 직접 등록하고,  
다른 사람의 여행 데이터를 참고해 **현실적인 계획을 세울 수 있으며**,  
GPT 기반 AI 챗봇을 통해 조건에 맞는 여행지를 추천받을 수 있습니다.

## ✨ 주요 기능

### 🧭 공통
| <img width="300" alt="메인-게시글" src="https://github.com/user-attachments/assets/e6f2e8e2-c845-471d-b530-3b97ad98a40f" /> | <img width="300" alt="메인-여행지" src="https://github.com/user-attachments/assets/efcfe97a-48f2-4f56-9bfe-d942cf0d51fc" /> | <img width="300" alt="메인-검색" src="https://github.com/user-attachments/assets/cd518b00-8e9f-421e-a850-22a18a57d473" /> | <img width="300" alt="여행 추천 챗봇" src="https://github.com/user-attachments/assets/6d6e6f25-1ff3-4d9e-9c88-425c45d8fdd4" /> | <img width="300" alt="로그인" src="https://github.com/user-attachments/assets/95f60ec0-70e1-44d4-a5e0-b664e0547277" /> | <img width="300" alt="회원가입" src="https://github.com/user-attachments/assets/81b9747b-88d1-4de4-bbe4-3ec409dbd96b" /> |
| :-------------------------: | :-------------------------: | :-------------------------: | :-------------------------: | :-------------------------: | :-------------------------: |
| 메인 - 게시글 | 메인 - 여행지 | 메인 - 검색 | 여행 추천 챗봇 | 로그인 | 회원가입 |
- 여행지 및 게시글 **검색 / 필터 / 정렬** 기능  
  (비용, 지역, 별점, 카테고리 등 기준)
- **피드 형태**의 목록 제공 (여행지 / 게시글 모두)
- **로그인 없이도 피드 / 상세페이지 열람 가능**
- **로그인 시** 좋아요, 즐겨찾기, 작성 기능 사용 가능
- **GPT 기반 챗봇**을 통한 조건 기반 여행지 추천

### 📍 여행지
| <img width="300" alt="여행지 - 목록" src="https://github.com/user-attachments/assets/23f5a6a5-7fc4-41e3-90e8-bb5922cd31e4" /> | <img width="300" alt="여행지 - 상세" src="https://github.com/user-attachments/assets/3ebf175c-6128-4bfe-9484-924f9baf297c" /> | <img width="300" alt="여행지 - 리뷰" src="https://github.com/user-attachments/assets/8ea7b7be-2683-41fc-8427-124b7cfbceb1" /> | <img width="300" alt="등록된 여행지 목록" src="https://github.com/user-attachments/assets/fdfe20ca-5e9a-4067-8d5a-8ea91f33a67f" /> | <img width="300" alt="등록된 여행지 수정" src="https://github.com/user-attachments/assets/2cbec9cd-103e-4024-b65f-9bd3da2bec34" /> |
| :-------------------------: | :-------------------------: | :-------------------------: | :-------------------------: | :-------------------------: |
| 여행지 - 목록 | 여행지 - 상세 | 여행지 - 리뷰 | 여행지 - 등록된 목록 | 여행지 - 수정 |
- 이름, 지역, 카테고리, 방문 시간, 체류 시간, 메모, 비용 입력
- 여행지 **이미지 업로드** (최대 6장), 썸네일 이미지 지정
- **리뷰(댓글 + 별점)** 작성 및 열람
- **좋아요 / 즐겨찾기 / 조회수** 기록
- 여행지 단독 등록 또는 게시글과 연결 가능
- 임시 저장 기능 지원

### 📝 게시글 (여행 일정)
| <img width="300" alt="게시글 - 목록" src="https://github.com/user-attachments/assets/5311ac01-216e-4441-a6d4-78bc125a1fd4" /> | <img width="300" alt="게시글 - 부가기능" src="https://github.com/user-attachments/assets/cb0146ed-c8a2-4971-87d6-738cabd0a429" /> | <img width="300" alt="게시글 - 여행 일정" src="https://github.com/user-attachments/assets/6391e030-a707-49fc-b5a0-ec571472b097" /> | <img width="300" alt="게시글 - 여행 후기" src="https://github.com/user-attachments/assets/5295a748-3e61-44f8-a171-c8ddd61e5627" /> | <img width="300" alt="게시글 - 리뷰" src="https://github.com/user-attachments/assets/fefa4767-d83f-4784-b189-0c2be4271a14" /> | <img width="300" alt="게시글 - 등록" src="https://github.com/user-attachments/assets/3f73f44c-1b23-46f9-9050-f219c2fdc019" /> |
| :-------------------------: | :-------------------------: | :-------------------------: | :-------------------------: | :-------------------------: | :-------------------------: |
| 게시글 - 목록 | 게시글 - 부가기능 | 게시글 - 상세 (여행일정) | 게시글 - 상세 (여행후기) | 게시글 - 리뷰 | 게시글 - 등록 |
- 제목 / 본문 입력, 여행지 목록 구성 및 순서 지정
- **일정 탭 / 본문 탭 UI 분리**
- 활동 요약 정보 표시  
  (총 비용, 활동 수, 방문 지역, 전체 체류 시간 등)
- 게시글 단위로 **좋아요 / 조회수 / 리뷰** 기록
- 임시 저장 기능 지원
- 게시글 링크 복사로 **외부 공유 가능**

### 🙋 마이페이지
| <img width="300" alt="마이페이지 - 게시글" src="https://github.com/user-attachments/assets/955ce96f-19ee-4c02-889a-3d1019d31ff0" /> | <img width="300" alt="마이페이지 - 여행지" src="https://github.com/user-attachments/assets/bd256e28-1eef-44e1-a84c-fc07e4aecf3d" /> |
| :-------------------------: | :-------------------------: |
| 마이페이지 - 게시글 | 마이페이지 - 여행지 |
- 내가 작성한 여행지 / 게시글 목록 조회
- 각 항목에 대해 **수정 / 삭제** 기능 제공
- 내가 누른 좋아요 / 즐겨찾기 항목 관리

## 🗂️ 프로젝트 폴더 구조

```
📦 AIBE3-Project1-Team04
├── 📁 app # App Router 기반 페이지 디렉토리
│ ├── 📁 auth # 로그인 및 회원가입
│ ├── 📁 mypage # 마이페이지
│ ├── 📁 places # 여행지 관련 페이지
│ │ └── 📁 [id] # 여행지 상세 페이지
│ ├── 📁 posts # 게시글 관련 페이지
│ │ ├── 📁 [id] # 게시글 상세 페이지
│ │ └── 📁 create # 게시글 등록 페이지
├── 📁 components # 공통 UI 컴포넌트
│ ├── 📁 chat # 챗봇 관련 컴포넌트
│ ├── 📁 modal # 모달 관련 컴포넌트
│ ├── 📁 places # 여행지 컴포넌트
│ ├── 📁 posts # 게시글 컴포넌트
│ └── 📁 mypage # 마이페이지 컴포넌트
├── 📁 consts # 지역/카테고리 등 상수 관리
├── 📁 contexts # React Context API 정의
├── 📁 hooks # 커스텀 훅
└── 📁 lib # Supabase, 유틸 함수 등
```

### ✨ 간단 요약

- App Router를 사용하는 Next.js 구조
- 페이지/컴포넌트/기능 모듈화로 명확하게 역할 분리
- 유지보수와 협업에 용이하도록 설계

## ⚙️ 기술 스택

| 항목       | 기술                                             |
| ---------- | ------------------------------------------------ |
| 프론트엔드 | Next.js, Tailwind CSS, shadcn/ui                 |
| 상태관리   | Context API, Zustand                             |
| 유틸 도구  | date-fns (날짜 처리), nanoid (경량 고유 ID 생성) |
| 정적 분석  | Prettier, ESLint                                 |
| 백엔드     | Supabase (auth, DB, storage), PostgreSQL         |
| 인증       | Supabase Auth (Google, Kakao 소셜 로그인)        |
| AI 서비스  | OpenAI GPT API (챗봇 기반 추천)                  |
| AI UI 도구 | Readdy.ai, Cursor                                |
| 배포       | Vercel (CI/CD 자동 배포)                         |
| 협업       | GitHub (GitHub Flow 전략), Notion, Slack         |

## 🧩 ERD

<img width="2023" height="1285" alt="ERD Dialog" src="https://github.com/user-attachments/assets/15fd3ee1-1013-4235-b004-6059cc2ce232" />

👉 [ERD 전체 보기](https://www.erdcloud.com/d/JPNZrTTS5buYdTdSr/)

- 여행지(`places`)와 게시글(`posts`)은 **1:N 관계**로 연결되어 일정 구성이 가능합니다.
- `users`는 `auth.users`를 확장한 테이블로, **추가 프로필 정보**를 저장합니다.
- 여행지/게시글 각각에 대해 별도로:
  - 리뷰(`place_reviews`, `post_reviews`)
  - 좋아요(`likes`)
  - 즐겨찾기(`favorites`)
  - 조회수(`view_logs`)
    를 **개별 테이블로 관리**하여 통계 활용 및 추적이 용이합니다.
- 게시글과 여행지 연결은 `post_places` **중간 테이블(M:N)**을 통해 구성됩니다.
- 각 테이블 간 **외래키(FK) 제약조건**을 활용해 참조 무결성을 유지합니다.

## 🏗 시스템 아키텍처

| 개발 & 배포                                                                                                                         | 서비스 구성                                                                                                                          |
| ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| <img width="501" height="1385" alt="image" src="https://github.com/user-attachments/assets/6c68aeca-2601-4bdf-aadc-d141eecd645d" /> | <img width="1424" height="1258" alt="image" src="https://github.com/user-attachments/assets/8dc9a13d-5b24-4303-b5e3-28803b8bfadf" /> |
|                                                                                                                                     |

## 🤝 팀 협업 방식

### ✅ GitHub Flow 전략

1. 이슈 생성
2. 브랜치 생성 (`규칙 준수`)
3. 기능 개발
4. PR 작성 (PR 템플릿 기반)
5. 코드 리뷰 및 승인
6. `main` 브랜치로 merge → **Vercel 자동 배포**

---

### ✅ 함수명 & 변수명 컨벤션

- 함수명: **카멜케이스** 사용  
  예: `fetchUserData`, `updateTripList`

- 변수명: **명확한 명사**로 작성  
  예: `userList`, `destinationName`

- 상수: **대문자 스네이크 케이스** 사용  
  예: `API_BASE_URL`

- 함수는 다음과 같은 동사로 시작  
  `get`, `fetch`, `update`, `remove` 등

---

### ✅ Git & PR 규칙

- **커밋 컨벤션**  
  🔗 https://nowsun.tistory.com/146

- **Gitmoji 사용법**  
  🔗 https://nowsun.tistory.com/147

- **브랜치 네이밍 규칙**

  - 형식: `<type>/<식별자>`
  - 예시: `feat/place-form`, `fix/login-error`, `feature/#123-login-form`
  - 규칙: 소문자 사용, 공백 ❌, `-` 또는 `/`로 구분

- **코드리뷰 태그 작성법**  
  🔗 https://nowsun.tistory.com/95

- **PR 템플릿**  
  커스텀 템플릿 사용

## 📌 개발 현황

- 전체 기능 구현 완료 및 테스트 반영
- Vercel에 배포 완료
- 팀 협업 기반의 역할 분담 및 일정 준수

## 🐞 주요 이슈 및 해결

- `useCallback` 누락 → 의존성 배열 설정으로 해결
- Supabase Auth → 외부 테이블로 유저 정보 분리
- StrictMode로 인한 조회수 중복 증가 → 배포 환경에서 해결
- 브랜치 명 혼선 → 기능 중심 브랜치 네이밍 규칙 도입

## 🔄 향후 개선 계획

- **AI 챗봇 고도화**  
  GPT 챗봇이 Supabase DB 기반의 실제 데이터를 분석하여 추천 여행지를 더욱 정교하게 제안하도록 개선할 예정입니다.  
  추가로 조건 기반의 **자동 일정 생성 기능**도 기획 중입니다.

- **여행지 불러오기 기능 추가**  
  게시글 등록 시 새로 여행지를 입력하지 않고, **기존에 등록된 여행지를 선택하여 불러올 수 있는 기능**을 도입할 계획입니다.

- **해외 도시 데이터 확장**  
  현재는 국내 지역만 등록 가능하나, **해외 주요 도시 및 국가 데이터**를 포함하여 사용자의 선택 폭을 넓힐 예정입니다.

- **여행 인원 기반 비용 계산**  
  여행지에 **인원 수 데이터**를 추가하여, 비용을 인당 기준 또는 총합 기준으로 선택 가능하게 하고,  
  **보다 정확한 예산 추정 및 비교**가 가능하도록 개선할 예정입니다.

  ## 🗣️ 발표 및 피드백 회고

### 👍 긍정적인 피드백

- `gitmoji`, 브랜치 네이밍, PR 템플릿 등으로 **GitHub 협업 흐름이 명확하게 구성됨**
- 커밋 메시지, 이슈/PR 관리 등 **팀워크와 관리 측면에서 훌륭하게 정리됨**
- 사용된 **라이브러리 및 프레임워크의 도입 이유가 발표에서 잘 전달됨**
  - 예: `nanoid` → 경량 ID, `date-fns` → 가볍고 동적 관리가 쉬움 등

### 🔍 개선 피드백

- 일부 컴포넌트에 **`any` 타입**이 보이며, 타입 안전성 개선 여지 있음
- 로딩 시 딜레이가 느껴지는 부분은 **스켈레톤 UI나 로딩 다이얼로그**가 있었으면 좋았을 것
- 메인페이지의 **TOP 30 목록은 많아 보임** → 갯수 축소나 카테고리 분할 제안
- 전체 여행지/게시글 목록에서 **무한 스크롤 또는 페이지네이션 미적용**으로 스크롤이 김 → '맨 위로' 기능 추가 제안
- **회원가입 UI**가 탭마다 다르고, 모바일에서는 폼이 길어져 **스크롤 UX가 다소 불편**
- **정렬 기능(정렬 기준 오름/내림)**에 대한 시각적 표시가 없어 UX적으로 아쉬움
- 게시글/여행지 등록 시 **`textarea` 크기를 동적으로 조정**하거나 글자 수 제한 등을 시각화하면

> ✅ 일정상 시간이 빠듯했음에도 불구하고 전반적인 완성도와 관리가 좋았다는 평가를 받았습니다.

## 🧑‍💻 팀원 및 담당 역할

| 이름   | GitHub                                 | 주요 담당 역할                                                                                                                                                                               |
| ------ | -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 김동엽 | [@Yoepee](https://github.com/Yoepee)   | 팀장 / 전체 구조 설계 및 리딩<br>인증, 게시글/여행지 CRUD 구현<br>좋아요, 즐겨찾기, 조회수, 리뷰 기능<br>챗봇 연동 및 공유 기능 구현<br>ERD, Supabase 초기 설계 / 배포 설정 / 발표 자료 제작 |
| 정다솔 | [@dbjoung](https://github.com/dbjoung) | 마이페이지(여행지/게시글 목록, 수정, 삭제)<br>Readdy.ai 기반 UI 초안 설계<br>시나리오 기반 테스트 / QA 적극 참여                                                                             |
| 장근영 | [@geun-00](https://github.com/geun-00) | 게시글 목록 검색 / 필터 / 정렬 (조회순, 비용순, 좋아요순 등)<br>정렬 기준, UI 연동 개발                                                                                                      |
| 이록은 | [@Leere1](https://github.com/Leere1)   | 여행지 목록 정렬 / 필터 (좋아요순, 비용순 등)<br>여행지 좋아요 기능 (목록/상세)<br>오탈자 수정 및 테스트 참여                                                                                |
| 김희수 | [@inti0](https://github.com/inti0)     | 게시글 및 여행지 등록 유효성 검사 로직 구현<br>불필요 코드 정리 및 유지보수                                                                                                                  |
| 안지협 | [@TooTo3](https://github.com/TooTo3)   | 메인 페이지 검색 기능 초안 개발<br>코드 리딩 및 테스트 참여                                                                                                                                  |

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
