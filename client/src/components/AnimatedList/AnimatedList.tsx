import React from 'react';
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { useAutoAnimate } from '@formkit/auto-animate/react';

const fadeIn = keyframes({ from: { opacity: 0 }, to: { opacity: 1 } });

const Container = styled.div<{ duration: number }>(({ duration }) => ({
  animation: `${fadeIn} ${duration}ms ease-in`,
}));

interface Props {
  className?: string;
  duration?: number;
  children?: React.ReactNode;
}

export const AnimatedList = ({
  className,
  duration = 250,
  children,
}: Props) => {
  const [ref] = useAutoAnimate<HTMLDivElement>({ duration });
  return (
    <Container ref={ref} className={className} duration={duration}>
      {children}
    </Container>
  );
};
