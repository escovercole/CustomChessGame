
//Set up a stockfish worker and get recommended move based on game FEN

let stockfishWorker: Worker | null = null;

export const initializeStockfish = (): Worker => {
  if (!stockfishWorker) {
    // Ensure `process.env.PUBLIC_URL` is properly typed
    const publicUrl = import.meta.env.VITE_PUBLIC_URL || '';
    stockfishWorker = new Worker(`${publicUrl}/stockfish.js`);
  }
  return stockfishWorker;
};

export const terminateStockfish = (): void => {
  if (stockfishWorker) {
    stockfishWorker.terminate();
    stockfishWorker = null;
  }
};

export const getStockfishMove = (fen: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!stockfishWorker) {
      initializeStockfish();
    }

    if (stockfishWorker) {
      stockfishWorker.postMessage(`position fen ${fen}`);
      stockfishWorker.postMessage('go movetime 1000');

      stockfishWorker.onmessage = (event: MessageEvent) => {
        const message: string = event.data;
        if (message.startsWith('bestmove')) {
          const move = message.split(' ')[1];
          resolve(move);
        }
      };

      stockfishWorker.onerror = (err) => {
        reject(err);
      };
    } else {
      reject(new Error("Stockfish worker not initialized"));
    }
  });
};

