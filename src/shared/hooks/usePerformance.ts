/**
 * @fileoverview Performance optimization hooks for React components
 * @author Eduardo Valenzuela
 * @version 1.0.0
 */

import { 
  useCallback, 
  useMemo, 
  useRef, 
  useEffect, 
  useState,
  DependencyList,
} from 'react';

import { logger } from '../../infrastructure/utils/logger';

/**
 * Hook to measure component render performance
 * @param componentName Name of the component being measured
 * @returns Performance measurement functions
 */
export const useRenderPerformance = (componentName: string) => {
  const renderCount = useRef(0);
  const mountTime = useRef<number>(Date.now());
  
  useEffect(() => {
    renderCount.current += 1;
    
    if (renderCount.current === 1) {
      const mountDuration = Date.now() - mountTime.current;
      logger.performance(`${componentName} initial mount`, mountDuration);
    } else {
      logger.debug(`${componentName} re-render #${renderCount.current}`, undefined, 'PERFORMANCE');
    }
  });

  return useMemo(() => ({
    renderCount: renderCount.current,
    logRender: (reason?: string) => {
      logger.debug(
        `${componentName} render`,
        { renderCount: renderCount.current, reason },
        'PERFORMANCE'
      );
    },
  }), [componentName]);
};

/**
 * Hook to debounce a value to prevent excessive re-renders
 * @param value Value to debounce
 * @param delay Debounce delay in milliseconds
 * @returns Debounced value
 */
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Hook to throttle a function to prevent excessive calls
 * @param callback Function to throttle
 * @param delay Throttle delay in milliseconds
 * @returns Throttled function
 */
export const useThrottle = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const lastCall = useRef<number>(0);

  return useCallback((...args: Parameters<T>) => {
    const now = Date.now();
    
    if (now - lastCall.current >= delay) {
      lastCall.current = now;
      return callback(...args);
    }
  }, [callback, delay]) as T;
};

/**
 * Hook to memoize expensive computations with performance logging
 * @param factory Function that computes the value
 * @param deps Dependency array
 * @param name Optional name for performance logging
 * @returns Memoized value
 */
export const usePerformantMemo = <T>(
  factory: () => T,
  deps: DependencyList,
  name?: string
): T => {
  return useMemo(() => {
    const startTime = Date.now();
    const result = factory();
    const duration = Date.now() - startTime;
    
    if (name && duration > 50) { // Log if computation takes more than 50ms
      logger.performance(`useMemo computation: ${name}`, duration);
    }
    
    return result;
  }, deps);
};

/**
 * Hook to create stable callback references with performance monitoring
 * @param callback Callback function
 * @param deps Dependency array
 * @param name Optional name for performance logging
 * @returns Stable callback reference
 */
export const usePerformantCallback = <T extends (...args: any[]) => any>(
  callback: T,
  deps: DependencyList,
  name?: string
): T => {
  const callCount = useRef(0);
  
  return useCallback((...args: Parameters<T>) => {
    callCount.current += 1;
    
    const startTime = Date.now();
    const result = callback(...args);
    const duration = Date.now() - startTime;
    
    if (name && duration > 100) { // Log if callback takes more than 100ms
      logger.performance(
        `useCallback execution: ${name}`,
        duration,
        { callCount: callCount.current }
      );
    }
    
    return result;
  }, deps) as T;
};

/**
 * Hook to detect if component is mounted to prevent state updates on unmounted components
 * @returns Object with isMounted flag and safeSetState function
 */
export const useMountedRef = () => {
  const isMounted = useRef(true);
  
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  return useMemo(() => ({
    isMounted: () => isMounted.current,
    safeSetState: <T>(setState: React.Dispatch<React.SetStateAction<T>>, value: T | ((prevState: T) => T)) => {
      if (isMounted.current) {
        setState(value);
      }
    },
  }), []);
};

/**
 * Hook to measure and log component lifecycle performance
 * @param componentName Name of the component
 * @param options Performance measurement options
 * @returns Performance measurement utilities
 */
export const useComponentPerformance = (
  componentName: string,
  options: {
    logMounts?: boolean;
    logRenders?: boolean;
    logUpdates?: boolean;
  } = {}
) => {
  const { logMounts = true, logRenders = false, logUpdates = true } = options;
  
  const mountTime = useRef<number>(Date.now());
  const lastRenderTime = useRef<number>(Date.now());
  const renderCount = useRef(0);
  const updateReasons = useRef<string[]>([]);
  
  // Track mount performance
  useEffect(() => {
    if (logMounts) {
      const mountDuration = Date.now() - mountTime.current;
      logger.performance(`${componentName} mount`, mountDuration);
    }
    
    return () => {
      if (logMounts) {
        const totalLifetime = Date.now() - mountTime.current;
        logger.performance(`${componentName} unmount`, totalLifetime, {
          totalRenders: renderCount.current,
        });
      }
    };
  }, [componentName, logMounts]);
  
  // Track render performance
  useEffect(() => {
    renderCount.current += 1;
    const now = Date.now();
    const renderDuration = now - lastRenderTime.current;
    lastRenderTime.current = now;
    
    if (logRenders && renderCount.current > 1) {
      logger.debug(
        `${componentName} render #${renderCount.current}`,
        { renderDuration, reasons: updateReasons.current },
        'PERFORMANCE'
      );
    }
    
    updateReasons.current = [];
  });
  
  const logUpdateReason = useCallback((reason: string) => {
    if (logUpdates) {
      updateReasons.current.push(reason);
    }
  }, [logUpdates]);
  
  return useMemo(() => ({
    logUpdateReason,
    getRenderCount: () => renderCount.current,
    getLifetime: () => Date.now() - mountTime.current,
  }), [logUpdateReason]);
};

/**
 * Hook to prevent unnecessary re-renders by comparing previous props
 * @param props Current props
 * @param isEqual Custom equality function
 * @returns Previous props if equal, current props if different
 */
export const usePrevious = <T>(props: T, isEqual?: (prev: T, current: T) => boolean): T => {
  const ref = useRef<T>(props);
  
  useEffect(() => {
    const areEqual = isEqual ? isEqual(ref.current, props) : Object.is(ref.current, props);
    
    if (!areEqual) {
      ref.current = props;
    }
  });
  
  return ref.current;
};

/**
 * Hook to create a stable object reference that only changes when dependencies change
 * @param deps Dependencies that should trigger object recreation
 * @returns Stable object with dependency values
 */
export const useStableObject = (deps: DependencyList): Record<string, any> => {
  return useMemo(() => {
    const obj: Record<string, any> = {};
    deps.forEach((dep, index) => {
      obj[`dep${index}`] = dep;
    });
    return obj;
  }, deps);
};

/**
 * Hook to detect heavy re-renders and log warnings
 * @param componentName Component name for logging
 * @param threshold Time threshold in ms to consider render as heavy
 */
export const useHeavyRenderDetector = (componentName: string, threshold: number = 16) => {
  const renderStart = useRef<number>(0);
  
  // Mark render start
  renderStart.current = Date.now();
  
  useEffect(() => {
    const renderDuration = Date.now() - renderStart.current;
    
    if (renderDuration > threshold) {
      logger.warn(
        `Heavy render detected in ${componentName}`,
        { duration: renderDuration, threshold },
        'PERFORMANCE'
      );
    }
  });
};
