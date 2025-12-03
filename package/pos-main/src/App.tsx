import { PosPrac } from '@posprac/sdk';
import { useEffect, useState } from 'react';

// 1. 메인 POS로 초기화
const pos = new PosPrac({
  url: 'ws://localhost:8080',
  type: 'MAIN', // 🔥 핵심: 나는 메인이다!
  id: 'COUNTER_01',
});

interface OrderLog {
  time: string;
  msg: string;
}

export default function App() {
  const [orders, setOrders] = useState<OrderLog[]>([]);

  useEffect(() => {
    // 2. 주문 알림 구독 (테이블이나 배민에서 주문 오면 여기 뜸)
    pos.on('ORDER_INCOMING', (data) => {
      console.log('왔음', data);
      const msg = `[주문] ${data.menu} (${data.price}원)`;
      setOrders((prev) => [{ time: new Date().toLocaleTimeString(), msg }, ...prev]);
    });

    pos.connect();
  }, []);

  return (
    <div style={{ padding: 20, background: '#222', minHeight: '100vh', color: 'white' }}>
      <h1>🖥️ MAIN POS (카운터)</h1>
      <div style={{ border: '1px solid #444', padding: 20, borderRadius: 10 }}>
        <h3>🔔 실시간 주문 내역</h3>
        {orders.length === 0 ? <p style={{ color: '#666' }}>주문 대기 중...</p> : null}

        {orders.map((log, i) => (
          <div key={i} style={{ padding: '10px', borderBottom: '1px solid #444', fontSize: 20 }}>
            <span style={{ color: '#aaa', marginRight: 10 }}>{log.time}</span>
            <span style={{ color: '#4ade80' }}>{log.msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
