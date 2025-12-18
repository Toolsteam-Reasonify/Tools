import { useEffect, useMemo, useRef, useState } from 'react';

type AnimatedTextProps = {
  text: string;
  delay?: number; // initial delay before starting animation (ms)
  speed?: number; // time between each word reveal (ms)
  className?: string;
  loop?: boolean; // if true, repeats the animation
  pauseBetweenLoopsMs?: number; // pause before restarting when looping
  direction?: 'ltr' | 'rtl'; // reveal from left-to-right or right-to-left
};

export default function AnimatedText({
  text,
  delay = 0,
  speed = 120,
  className,
  loop = false,
  pauseBetweenLoopsMs = 800,
  direction = 'ltr',
}: AnimatedTextProps) {
  const words = useMemo(() => (text || '').split(/\s+/).filter(Boolean), [text]);
  const [visibleCount, setVisibleCount] = useState(0);
  const timeoutRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);

  const clearTimers = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    clearTimers();
    setVisibleCount(0);

    timeoutRef.current = window.setTimeout(() => {
      intervalRef.current = window.setInterval(() => {
        setVisibleCount((prev) => {
          const next = prev + 1;
          if (next >= words.length) {
            clearTimers();
            if (loop && words.length > 0) {
              timeoutRef.current = window.setTimeout(() => {
                setVisibleCount(0);
                intervalRef.current = window.setInterval(() => {
                  setVisibleCount((p) => {
                    const n = p + 1;
                    if (n >= words.length) {
                      clearTimers();
                    }
                    return n;
                  });
                }, speed);
              }, pauseBetweenLoopsMs);
            }
            return words.length;
          }
          return next;
        });
      }, speed);
    }, delay);

    return () => clearTimers();
  }, [text, delay, speed, loop, pauseBetweenLoopsMs, words.length]);

  const total = words.length;

  return (
    <span className={className}>
      {words.map((word, idx) => {
        const isVisible = direction === 'rtl'
          ? idx >= total - visibleCount
          : idx < visibleCount;
        return (
          <span key={idx} className="inline">
            <span
              className="inline-block align-baseline"
              style={{ visibility: isVisible ? 'visible' : 'hidden' }}
            >
              {word}
            </span>
            {idx < total - 1 ? ' ' : ''}
          </span>
        );
      })}
    </span>
  );
}


