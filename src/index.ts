import lazy from './lazy';

type Callback = (...args: any[]) => void;

let callbacks: Callback[] = [];

const random = `queueMacrotask_${Math.ceil(Math.random() * 100000)}`;

const postMessageByBroadcastChannel = () => {
  const broadcastChannel1 = new BroadcastChannel(random);
  const broadcastChannel2 = new BroadcastChannel(random);

  broadcastChannel2.addEventListener('message', () => {
    while (callbacks.length > 0) {
      callbacks.shift()?.();
    }
  });

  return (callback: Callback) => {
    callbacks.push(callback);
    broadcastChannel1.postMessage('');
    return () => {
      callbacks = callbacks.filter((cb) => cb !== callback);
    };
  };
};

const postMessageByWindow = () => {
  const origin = `${window.location.protocol}//${window.location.host}`;
  window.addEventListener('message', (e) => {
    e.stopPropagation();
    console.log(callbacks);
    if (e.origin === origin && e.data === random) {
      while (callbacks.length > 0) {
        callbacks.shift()?.();
      }
    }
  });

  return (callback: Callback) => {
    callbacks.push(callback);
    window.postMessage(random, origin);
    return () => {
      callbacks = callbacks.filter((cb) => cb !== callback);
    };
  };
};

export function queueMacrotask(callback: Callback) {
  if (typeof setImmediate === 'function') {
    const immediateID = setImmediate(callback);
    return () => {
      clearImmediate(immediateID);
    };
  }

  if (typeof BroadcastChannel === 'function') {
    return lazy(postMessageByBroadcastChannel)(callback);
  }

  if (typeof postMessage === 'function') {
    return lazy(postMessageByWindow)(callback);
  }

  const timeoutID = setTimeout(callback, 0);

  return () => {
    clearTimeout(timeoutID);
  };
}
