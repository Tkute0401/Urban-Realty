// Loading State Management System
import React, { useState, useCallback, useRef } from 'react';

// Loading state interface
export interface LoadingState {
  isLoading: boolean;
  message?: string;
  progress?: number;
  startTime?: Date;
  estimatedDuration?: number;
}

// Loading manager class
export class LoadingManager {
  private static instance: LoadingManager;
  private loadingStates: Map<string, LoadingState> = new Map();
  private subscribers: Set<(states: Map<string, LoadingState>) => void> = new Set();

  private constructor() {}

  static getInstance(): LoadingManager {
    if (!LoadingManager.instance) {
      LoadingManager.instance = new LoadingManager();
    }
    return LoadingManager.instance;
  }

  // Start loading for a specific operation
  startLoading(
    operationId: string,
    message?: string,
    estimatedDuration?: number
  ): void {
    const loadingState: LoadingState = {
      isLoading: true,
      message,
      progress: 0,
      startTime: new Date(),
      estimatedDuration,
    };

    this.loadingStates.set(operationId, loadingState);
    this.notifySubscribers();
  }

  // Update loading progress
  updateProgress(operationId: string, progress: number, message?: string): void {
    const currentState = this.loadingStates.get(operationId);
    if (currentState) {
      const updatedState: LoadingState = {
        ...currentState,
        progress: Math.min(100, Math.max(0, progress)),
        message: message || currentState.message,
      };
      this.loadingStates.set(operationId, updatedState);
      this.notifySubscribers();
    }
  }

  // Stop loading for a specific operation
  stopLoading(operationId: string): void {
    this.loadingStates.delete(operationId);
    this.notifySubscribers();
  }

  // Get loading state for a specific operation
  getLoadingState(operationId: string): LoadingState | undefined {
    return this.loadingStates.get(operationId);
  }

  // Check if any operation is loading
  isAnyLoading(): boolean {
    return this.loadingStates.size > 0;
  }

  // Get all loading states
  getAllLoadingStates(): Map<string, LoadingState> {
    return new Map(this.loadingStates);
  }

  // Get loading states as array
  getLoadingStatesArray(): Array<{ id: string; state: LoadingState }> {
    return Array.from(this.loadingStates.entries()).map(([id, state]) => ({
      id,
      state,
    }));
  }

  // Subscribe to loading state changes
  subscribe(callback: (states: Map<string, LoadingState>) => void): () => void {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  // Notify all subscribers
  private notifySubscribers(): void {
    this.subscribers.forEach(callback => {
      try {
        callback(new Map(this.loadingStates));
      } catch (error) {
        console.error('Error in loading state subscriber:', error);
      }
    });
  }

  // Clear all loading states
  clearAll(): void {
    this.loadingStates.clear();
    this.notifySubscribers();
  }

  // Get loading summary
  getLoadingSummary(): {
    totalOperations: number;
    isLoading: boolean;
    operations: Array<{ id: string; state: LoadingState }>;
  } {
    return {
      totalOperations: this.loadingStates.size,
      isLoading: this.isAnyLoading(),
      operations: this.getLoadingStatesArray(),
    };
  }
}

// Create singleton instance
export const loadingManager = LoadingManager.getInstance();

// React hook for loading management
export const useLoading = (operationId?: string) => {
  const [loadingStates, setLoadingStates] = useState<Map<string, LoadingState>>(
    new Map()
  );

  // Subscribe to loading state changes
  const subscribe = useCallback(() => {
    return loadingManager.subscribe(setLoadingStates);
  }, []);

  // Start loading
  const startLoading = useCallback(
    (id: string, message?: string, estimatedDuration?: number) => {
      loadingManager.startLoading(id, message, estimatedDuration);
    },
    []
  );

  // Update progress
  const updateProgress = useCallback(
    (id: string, progress: number, message?: string) => {
      loadingManager.updateProgress(id, progress, message);
    },
    []
  );

  // Stop loading
  const stopLoading = useCallback((id: string) => {
    loadingManager.stopLoading(id);
  }, []);

  // Get loading state for specific operation
  const getLoadingState = useCallback(
    (id: string) => {
      return loadingManager.getLoadingState(id);
    },
    []
  );

  // Check if any operation is loading
  const isAnyLoading = useCallback(() => {
    return loadingManager.isAnyLoading();
  }, []);

  // Get current loading state for the operation
  const currentLoadingState = operationId
    ? loadingManager.getLoadingState(operationId)
    : undefined;

  return {
    loadingStates,
    currentLoadingState,
    startLoading,
    updateProgress,
    stopLoading,
    getLoadingState,
    isAnyLoading,
    subscribe,
  };
};

// Higher-order component for loading management
export const withLoading = <P extends object>(
  Component: React.ComponentType<P>,
  operationId: string
) => {
  const LoadingWrapper = (props: P) => {
    const { currentLoadingState, startLoading, stopLoading } = useLoading(operationId);

    return (
      <Component
        {...props}
        loadingState={currentLoadingState}
        startLoading={startLoading}
        stopLoading={stopLoading}
      />
    );
  };
  
  LoadingWrapper.displayName = `withLoading(${Component.displayName || Component.name})`;
  return LoadingWrapper;
};

// Loading context for global loading state
export const LoadingContext = React.createContext<{
  loadingStates: Map<string, LoadingState>;
  startLoading: (id: string, message?: string, estimatedDuration?: number) => void;
  updateProgress: (id: string, progress: number, message?: string) => void;
  stopLoading: (id: string) => void;
  getLoadingState: (id: string) => LoadingState | undefined;
  isAnyLoading: () => boolean;
}>({
  loadingStates: new Map(),
  startLoading: () => {},
  updateProgress: () => {},
  stopLoading: () => {},
  getLoadingState: () => undefined,
  isAnyLoading: () => false,
});

// Loading provider component
export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [loadingStates, setLoadingStates] = useState<Map<string, LoadingState>>(
    new Map()
  );

  const subscribe = useCallback(() => {
    return loadingManager.subscribe(setLoadingStates);
  }, []);

  const startLoading = useCallback(
    (id: string, message?: string, estimatedDuration?: number) => {
      loadingManager.startLoading(id, message, estimatedDuration);
    },
    []
  );

  const updateProgress = useCallback(
    (id: string, progress: number, message?: string) => {
      loadingManager.updateProgress(id, progress, message);
    },
    []
  );

  const stopLoading = useCallback((id: string) => {
    loadingManager.stopLoading(id);
  }, []);

  const getLoadingState = useCallback(
    (id: string) => {
      return loadingManager.getLoadingState(id);
    },
    []
  );

  const isAnyLoading = useCallback(() => {
    return loadingManager.isAnyLoading();
  }, []);

  // Subscribe to loading state changes
  React.useEffect(() => {
    const unsubscribe = subscribe();
    return unsubscribe;
  }, [subscribe]);

  const value = {
    loadingStates,
    startLoading,
    updateProgress,
    stopLoading,
    getLoadingState,
    isAnyLoading,
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
};

// Hook to use loading context
export const useLoadingContext = () => {
  const context = React.useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoadingContext must be used within a LoadingProvider');
  }
  return context;
};

// Utility functions for common loading scenarios
export async function withAsyncLoading<T>(
  operationId: string,
  asyncOperation: () => Promise<T>,
  message?: string,
  estimatedDuration?: number
): Promise<T> {
  try {
    loadingManager.startLoading(operationId, message, estimatedDuration);
    const result = await asyncOperation();
    return result;
  } finally {
    loadingManager.stopLoading(operationId);
  }
}

export async function withProgressLoading<T>(
  operationId: string,
  asyncOperation: (updateProgress: (progress: number, message?: string) => void) => Promise<T>,
  message?: string,
  estimatedDuration?: number
): Promise<T> {
  try {
    loadingManager.startLoading(operationId, message, estimatedDuration);
    const result = await asyncOperation((progress, msg) => {
      loadingManager.updateProgress(operationId, progress, msg);
    });
    return result;
  } finally {
    loadingManager.stopLoading(operationId);
  }
}

export default loadingManager;