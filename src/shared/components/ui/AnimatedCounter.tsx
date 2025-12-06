import { useSpring, animated } from '@react-spring/web';
import { useEffect, useState } from 'react';

const AnimatedCounter = ({ value }: { value: number }) => {
  const [prev, setPrev] = useState(0);

  const { number } = useSpring({
    from: { number: prev },
    to: { number: value },
    config: {
      tension: 180,  // Controls "spring tightness" (higher = faster)
      friction: 12,  // Controls resistance (lower = more bounce)
      mass: 1.2,     // Controls weight of the spring
    },
    onRest: () => setPrev(value),
  });

  return (
    <animated.span>
      {number.to((n) => Math.floor(n).toLocaleString())}
    </animated.span>
  );
};

export default AnimatedCounter;
