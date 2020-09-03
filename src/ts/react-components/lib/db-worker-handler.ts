
export const dbWorkerHandler = (dbWorker: Worker, data: unknown) => {
  return new Promise(
    (resolve, reject) => {
      dbWorker.addEventListener(
        'message',
        (event) => {
          const result = event.data;
          resolve(result);
        },
        { once: true }
      );
      dbWorker.addEventListener(
        'error',
        (event) => {
          reject(event.message);
        },
        { once: true }
      );
      dbWorker.postMessage(data);
    }
  );
}