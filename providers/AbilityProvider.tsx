import { createContext, useContext, useEffect } from 'react';

import { AppAbility, defineAbilities, updateAbility } from '@/libs/casl';
import { createContextualCan } from '@casl/react';

import { useStore } from './StoreProvider';

const ability = defineAbilities();

const AbilityContext = createContext<AppAbility>(ability);

export const AbilityProvider = ({ children }: { children: React.ReactNode }) => {
  const user = useStore((state) => state.user);

  useEffect(() => {
    user && updateAbility(ability, user);
  }, [user, ability]);

  return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>;
};

export const useAbility = (): AppAbility => {
  const context = useContext(AbilityContext);

  if (!context) {
    throw new Error('useAbility must be used within AbilityProvider');
  }

  return context;
};

export const Can = createContextualCan(AbilityContext.Consumer);
