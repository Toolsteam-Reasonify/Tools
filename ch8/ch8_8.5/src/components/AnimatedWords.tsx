import React from 'react';
import { motion } from 'framer-motion';

type AnimatedWordsProps = {
  text: string;
  className?: string;
  startDelay?: number; // base delay before first word
  wordDelay?: number;  // per-word stagger
  wrapper?: keyof JSX.IntrinsicElements; // optional wrapper element (e.g., 'strong')
  wrapperClassName?: string;
};

const AnimatedWords: React.FC<AnimatedWordsProps> = ({
  text,
  className,
  startDelay = 0,
  wordDelay = 0.04,
  wrapper: Wrapper = 'span',
  wrapperClassName,
}) => {
  const words = React.useMemo(() => text.split(/(\s+)/).filter(Boolean), [text]);

  return (
    <Wrapper className={wrapperClassName}>
      {words.map((token, idx) => {
        const isSpace = /^\s+$/.test(token);
        if (isSpace) return <span key={`space-${idx}`}>{token}</span>;
        return (
          <motion.span
            key={`word-${idx}`}
            className={className}
            style={{ display: 'inline-block' }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, delay: startDelay + idx * wordDelay }}
          >
            {token}
          </motion.span>
        );
      })}
    </Wrapper>
  );
};

export default AnimatedWords;


