import { useStore } from '@/providers/StoreProvider';
import { Affix, Button, rem, Transition } from '@mantine/core';
import { FaArrowUp } from 'react-icons/fa';

interface ToTopButtonProps {
  viewportRef: React.RefObject<HTMLDivElement>;
}

export default function ToTopButton({ viewportRef }: ToTopButtonProps) {
  const { scrollY } = useStore((store) => store);

  return (
    <Affix position={{ bottom: 30, right: 50 }}>
      <Transition transition='slide-up' mounted={scrollY > 100}>
        {(transitionStyles) => (
          <div
            className='cursor-pointer rounded-full bg-violet-600 p-3 shadow-lg'
            style={transitionStyles}
            onClick={() => viewportRef.current!.scrollTo({ top: 0, behavior: 'smooth' })}>
            <FaArrowUp style={{ width: rem(16), height: rem(16) }} />
          </div>
        )}
      </Transition>
    </Affix>
  );
}
