/* =====================================================
   Time Engine
   File: core/time.engine.js
   Responsibility:
   - Global tick system (1s)
   - Safe subscribe / unsubscribe
   - No UI rendering here
===================================================== */

const TimeEngine = (() => {
  let intervalId = null;
  const listeners = new Set();

  function start() {
    if (intervalId) return;

    intervalId = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      listeners.forEach(fn => {
        try {
          fn(now);
        } catch (e) {
          console.error("TimeEngine listener error", e);
        }
      });
    }, 1000);
  }

  function stop() {
    if (!intervalId) return;
    clearInterval(intervalId);
    intervalId = null;
  }

  function subscribe(fn) {
    listeners.add(fn);
    start();
  }

  function unsubscribe(fn) {
    listeners.delete(fn);
    if (listeners.size === 0) {
      stop();
    }
  }

  return {
    subscribe,
    unsubscribe
  };
})();
