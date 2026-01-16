import React from 'react';

import { getNetworkStatus, type NetworkStatus } from '@data/network/status';

type UseNetworkStatusOptions = {
  intervalMs?: number;
  timeoutMs?: number;
  url?: string;
};

export const useNetworkStatus = (
  options: UseNetworkStatusOptions = {},
): { status: NetworkStatus; refresh: () => void; isChecking: boolean } => {
  const intervalMs = options.intervalMs ?? 30000;
  const timeoutMs = options.timeoutMs ?? 3000;
  const url = options.url;

  const [status, setStatus] = React.useState<NetworkStatus>('unknown');
  const [isChecking, setIsChecking] = React.useState(false);

  const checkStatus = React.useCallback(async () => {
    setIsChecking(true);
    try {
      const next = await getNetworkStatus({ timeoutMs, ...(url ? { url } : {}) });
      setStatus(next);
    } finally {
      setIsChecking(false);
    }
  }, [timeoutMs, url]);

  React.useEffect(() => {
    let isActive = true;

    const runCheck = async () => {
      setIsChecking(true);
      try {
        const next = await getNetworkStatus({ timeoutMs, ...(url ? { url } : {}) });
        if (isActive) {
          setStatus(next);
        }
      } finally {
        if (isActive) {
          setIsChecking(false);
        }
      }
    };

    runCheck();
    const intervalId = intervalMs > 0 ? setInterval(runCheck, intervalMs) : null;
    return () => {
      isActive = false;
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalMs, timeoutMs, url]);

  return { status, refresh: checkStatus, isChecking };
};
