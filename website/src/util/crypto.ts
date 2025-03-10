import SparkMD5 from 'spark-md5';
import { FileChunk, isNil } from '.';

export const getMD5 = async (file: Blob, chunkSize = 2 * 1024 * 1024) => {
  // 计算文件md5
  return new Promise<string>((resolve, reject) => {
    const fileReader = new FileReader();
    const chunkCount = Math.ceil(file.size / chunkSize);
    const spark = new SparkMD5.ArrayBuffer();

    let currentPieces = 0;
    const loadNext = () => {
      const start = currentPieces * chunkSize;
      const end = start * chunkSize >= file.size ? file.size : start + chunkSize;
      fileReader.readAsArrayBuffer(file.slice(start, end));
    };
    fileReader.onload = (e) => {
      if (isNil(e.target) || isNil(e.target.result)) {
        console.error('e.target or e.target.result is nil, ProcessEvent:', e);
        return;
      }
      spark.append(e.target.result as ArrayBuffer);
      currentPieces++;
      if (currentPieces < chunkCount) {
        loadNext();
      } else {
        resolve(spark.end());
      }
    };
    fileReader.onerror = (err) => {
      reject(err);
    };
    loadNext();
  });
};

export const getMD5ByChunks = async (chunks: FileChunk[]) => {
  const spark = new SparkMD5.ArrayBuffer();
  for (const c of chunks) {
    spark.append(await c.chunk.arrayBuffer());
  }
  const hash = spark.end();
  return hash;
};
