import { workerOutput } from "../../declaration/wdtt-viewer";

export const wdttFileWorkerHandler = (file: Blob) => {
  const wdttWorker = new Worker('./js/worker/wdtt-worker.js');
  wdttWorker.postMessage({ file });

  return new Promise(
    (resolve, reject) => {
      wdttWorker.addEventListener(
        'message',
        (event) => {
          const result = event.data as workerOutput;
          resolve(result);
        }
      );
      wdttWorker.addEventListener(
        'error',
        (event) => {
          reject(event.message);
        }
      );
    }
  );
}