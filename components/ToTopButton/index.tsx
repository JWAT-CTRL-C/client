import { useStore } from '@/providers/StoreProvider';
import { Affix, Button, rem, Transition } from '@mantine/core';
import { FaArrowUp } from 'react-icons/fa';

interface ToTopButtonProps {
  viewportRef: React.RefObject<HTMLDivElement>;
}

export default function ToTopButton({ viewportRef }: ToTopButtonProps) {
  const { scrollY } = useStore((store) => store);

  return (
    <Affix position={{ bottom: 20, right: 20 }}>
      <Transition transition='slide-up' mounted={scrollY > 100}>
        {(transitionStyles) => (
          <Button
            leftSection={<FaArrowUp style={{ width: rem(16), height: rem(16) }} />}
            style={transitionStyles}
            onClick={() => viewportRef.current!.scrollTo({ top: 0, behavior: 'smooth' })}>
            Scroll to top
          </Button>
        )}
      </Transition>
    </Affix>
  );
}
