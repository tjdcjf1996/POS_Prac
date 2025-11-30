import { CommandQueue } from './CommandQueue';
import { CloudClient } from './core/CloudClient';
import { CommandWorker } from './core/CommandWorker';
import { SdkServer } from './core/SdkServer';
import dotenv from 'dotenv';
dotenv.config();

const STORE_ID = process.env.STORE_ID || 'VIRTUAL_STORE_001';
const CLOUD_URL = process.env.CLOUD_URL || 'ws://localhost:4000?storeId=' + STORE_ID;
const SDK_PORT = process.env.SDK_PORT ? parseInt(process.env.SDK_PORT) : 8080;

async function main() {
  // 커맨드 공용 큐 생성
  const queue = new CommandQueue();

  // 서버 및 클라이언트 추가
  const sdkServer = new SdkServer(SDK_PORT, queue);
  const cloudClient = new CloudClient(CLOUD_URL, queue);

  // 워커 초기화
  const worker = new CommandWorker(queue, sdkServer);

  // 서버 가동
  cloudClient.connect();
  await worker.init();
}

main();
