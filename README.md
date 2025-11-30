# 💳 POS_Prac
## 📖 프로젝트 개요

이 프로젝트는 딜리버리 서버(AWS) - 엣지(매장 POS) - 클라이언트(Web)가 유기적으로 연결된 POS 시스템 아키텍처를 구현한 모노레포 프로젝트 입니다.
웹 브라우저의 기술적 한계로 하드웨어를 직접 제어할 수 없기 때문에 로컬 브릿지 서버를 구축하였으며, 그 외 동작을 간단하게 구현하였습니다.

-----

## 🏗️ 시스템 아키텍처

<img width="4448" height="3232" alt="image" src="https://github.com/user-attachments/assets/f90dca1f-69db-496d-91fa-8244d2bb883c" />

## 🔥 주요 기능
### 1. 웹소켓

  * 대부분의 매장이 공유기 사설 환경이기 때문에 외부 배달 서버에서 제어할 수 있도록, Edge가 Cloud로 먼저 연결을 맺는 방식을 구현했습니다.
  * 네트워크 단절 시 3초 주기 자동 재연결을 시도합니다.

### 2. 우선순위

  * 하드웨어 요청과 주문, 결제에 대한 경합을 방지하기 위해 Command Queue를 도입했습니다.
  * 우선순위를 정할 수 있기 때문에 영수증 출력이 다음 순서였어도 결제 요청이 들어오면, 먼저 처리되도록 설계되었습니다.

### 3. SDK

  * 복잡한 소켓 통신을 숨기고 모듈로 추상화하여 프론트엔드 개발자가 쉽게 사용할 수 있도록 구현했습니다.
  * Promise 기반의 요청과 Event Emitter를 이용한 이벤트 발생을 지원합니다.
      * `await pos.payment.request()` (Promise)
      * `pos.on('ORDER_INCOMING')` (Event Emitter)

### 4. 버츄얼 프린터 기능

  * 실제 장비 없이도 개발 가능하도록 웹 가상 프린터를 구현했습니다.
  * 콘솔 로그뿐만 아니라, 브라우저 화면에 영수증이 출력됩니다.

-----

## 📂 프로젝트 구조 (Monorepo)

`npm workspaces`를 사용하여 4개의 패키지를 통합 관리합니다.

| 패키지명 | 역할 | 
| :--- | :--- | 
| **`packages/shared`** | 공통 타입 정의 |
| **`packages/cloud-server`** | 외부 주문 중계 (웹훅) | 
| **`packages/edge-bridge`** | 하드웨어 제어 및 로컬 허브 |
| **`packages/sdk`** | 프론트엔드용 라이브러리 | 

-----

## 🚀 설치 및 실행 
### 1. 설치

```bash
# 루트 디렉토리에서 의존성 일괄 설치
npm install
```

### 2. 환경 변수 설정 (.env)

각 서버 폴더에 `.env` 파일을 생성합니다.

**`packages/cloud-server/.env`**

```env
PORT=4000
API_KEY=api_key
```

**`packages/edge-bridge/.env`**

```env
STORE_ID=VIRTUAL_STORE_001
CLOUD_URL=ws://localhost:4000?storeId=VIRTUAL_STORE_001
SDK_PORT=8080
API_KEY=api_key
```

### 3. 전체 시스템 가동

터미널을 3개 열어 아래 순서대로 실행하세요.

1.  **Cloud Server 실행**
    ```bash
    npm run dev:cloud
    ```
2.  **Edge Bridge 실행**
    ```bash
    npm run dev:edge
    # 실행 시 자동으로 가상 하드웨어 뷰어(Chrome)가 뜹니다.
    ```

### 4. 외부 주문 테스트

```bash
curl -X POST http://localhost:4000/api/orders \
  -H "Content-Type: application/json" \
  -H "x-api-key: api_key" \
  -d '{"storeId": "STORE_001", "menu": "황금올리브치킨", "price": 22000}'
```

가상 뷰어에 영수증이 출력되고, SDK Demo 콘솔에 주문 알림이 뜹니다.
Insomnia를 이용하시면 더 편하게 테스트 가능합니다.

-----

아직 미완성인 프로젝트이므로, 해야할 것이 많습니다.
간단하게 구현해보는 것이 목적이기 때문에 bcrypt, jwt등을 사용하지 않고 간단하게 api키 인증만 시행합니다.

