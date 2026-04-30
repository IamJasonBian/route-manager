import { act, renderHook, waitFor } from '@testing-library/react';
import { useLivePolling } from '../useLivePolling';

describe('useLivePolling', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      get: () => 'visible',
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const setVisibility = (state: 'visible' | 'hidden') => {
    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      get: () => state,
    });
    document.dispatchEvent(new Event('visibilitychange'));
  };

  it('does not call fetcher when disabled', () => {
    const fetcher = jest.fn().mockResolvedValue(undefined);
    renderHook(() =>
      useLivePolling({ enabled: false, intervalMs: 1000, fetcher })
    );
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    expect(fetcher).not.toHaveBeenCalled();
  });

  it('invokes fetcher on each interval when enabled', async () => {
    const fetcher = jest.fn().mockResolvedValue(undefined);
    renderHook(() =>
      useLivePolling({ enabled: true, intervalMs: 1000, fetcher })
    );

    expect(fetcher).not.toHaveBeenCalled();

    await act(async () => {
      jest.advanceTimersByTime(1000);
    });
    expect(fetcher).toHaveBeenCalledTimes(1);

    await act(async () => {
      jest.advanceTimersByTime(1000);
    });
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it('updates lastUpdated and isRefreshing around fetcher calls', async () => {
    let resolveFetch: () => void = () => {};
    const fetcher = jest.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveFetch = resolve;
        })
    );
    const { result } = renderHook(() =>
      useLivePolling({ enabled: true, intervalMs: 1000, fetcher })
    );

    expect(result.current.isRefreshing).toBe(false);
    expect(result.current.lastUpdated).toBeNull();

    await act(async () => {
      jest.advanceTimersByTime(1000);
    });
    expect(result.current.isRefreshing).toBe(true);

    await act(async () => {
      resolveFetch();
      await Promise.resolve();
    });
    await waitFor(() => expect(result.current.isRefreshing).toBe(false));
    expect(result.current.lastUpdated).toBeInstanceOf(Date);
  });

  it('skips ticks while a fetch is still in flight', async () => {
    let resolveFetch: () => void = () => {};
    const fetcher = jest.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveFetch = resolve;
        })
    );
    renderHook(() =>
      useLivePolling({ enabled: true, intervalMs: 1000, fetcher })
    );

    await act(async () => {
      jest.advanceTimersByTime(1000);
    });
    expect(fetcher).toHaveBeenCalledTimes(1);

    // Advance several intervals while the first call has not resolved.
    await act(async () => {
      jest.advanceTimersByTime(3000);
    });
    expect(fetcher).toHaveBeenCalledTimes(1);

    await act(async () => {
      resolveFetch();
      await Promise.resolve();
    });

    await act(async () => {
      jest.advanceTimersByTime(1000);
    });
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it('skips ticks while the tab is hidden', async () => {
    const fetcher = jest.fn().mockResolvedValue(undefined);
    renderHook(() =>
      useLivePolling({ enabled: true, intervalMs: 1000, fetcher })
    );

    setVisibility('hidden');
    await act(async () => {
      jest.advanceTimersByTime(3000);
    });
    expect(fetcher).not.toHaveBeenCalled();
  });

  it('refreshes immediately when the tab becomes visible again', async () => {
    const fetcher = jest.fn().mockResolvedValue(undefined);
    renderHook(() =>
      useLivePolling({ enabled: true, intervalMs: 10000, fetcher })
    );

    setVisibility('hidden');
    await act(async () => {
      jest.advanceTimersByTime(5000);
    });
    expect(fetcher).not.toHaveBeenCalled();

    await act(async () => {
      setVisibility('visible');
      await Promise.resolve();
    });
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it('clears the interval on unmount', async () => {
    const fetcher = jest.fn().mockResolvedValue(undefined);
    const { unmount } = renderHook(() =>
      useLivePolling({ enabled: true, intervalMs: 1000, fetcher })
    );

    unmount();
    await act(async () => {
      jest.advanceTimersByTime(5000);
    });
    expect(fetcher).not.toHaveBeenCalled();
  });
});
