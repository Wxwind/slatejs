import { isNil } from '@/util';
import { PriorityQueue } from './priorityQueue';

interface ReqWrapper {
  request: () => void;
  priority: number;
}

export class ConnectionPool {
  private blockQueue = new PriorityQueue<ReqWrapper>((a, b) => a.priority < b.priority);

  private runningReqCount: number = 0;

  private maxLimitCount = 4;

  request = async <T>(req: () => Promise<T>, priority = 0) => {
    // 超出并发限制则放入阻塞队列
    if (this.runningReqCount >= this.maxLimitCount) {
      await new Promise((resolve, reject) => {
        this.blockQueue.push({
          request: () => resolve(undefined),
          priority,
        });
      });
    }

    // 有空闲连接后处理此请求
    return this.handleReq(req) as Promise<T>;
  };

  private handleReq = async (req: () => Promise<unknown>) => {
    this.runningReqCount++;
    const res = await req();
    this.runningReqCount--;
    // 让出空位后则尝试从阻塞队列中获取新请求
    const r = this.blockQueue.pop();
    if (!isNil(r)) {
      r.request();
    }
    return res;
  };
}

export const connnectionPool = new ConnectionPool();
