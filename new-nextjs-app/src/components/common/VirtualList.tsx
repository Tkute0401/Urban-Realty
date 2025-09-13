// Virtual List Component for Performance
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { calculateVirtualScrollItems } from '@/lib/utils/performanceOptimizer';

interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  overscan?: number;
}

function VirtualList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  className = '',
  overscan = 5,
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate visible items
  const visibleItems = useMemo(() => {
    return calculateVirtualScrollItems(
      containerHeight,
      itemHeight,
      scrollTop,
      items.length
    );
  }, [containerHeight, itemHeight, scrollTop, items.length]);

  // Handle scroll
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  // Get visible items with overscan
  const visibleItemsWithOverscan = useMemo(() => {
    const start = Math.max(0, visibleItems.startIndex - overscan);
    const end = Math.min(items.length, visibleItems.endIndex + overscan);
    
    return items.slice(start, end).map((item, index) => ({
      item,
      index: start + index,
    }));
  }, [items, visibleItems.startIndex, visibleItems.endIndex, overscan]);

  return (
    <div
      ref={containerRef}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: visibleItems.totalHeight, position: 'relative' }}>
        <div
          style={{
            transform: `translateY(${visibleItems.offsetY}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
          }}
        >
          {visibleItemsWithOverscan.map(({ item, index }) => (
            <div
              key={index}
              style={{
                height: itemHeight,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default VirtualList;