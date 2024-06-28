import { createContext, useContext, useEffect } from 'react';

import { defineAbilities, updateAbility } from '@/libs/casl';
import { AbilityTuple, MongoAbility, MongoQuery } from '@casl/ability';
import { createContextualCan } from '@casl/react';

import { useStore } from './StoreProvider';

const ability = defineAbilities();

const AbilityContext = createContext<MongoAbility<AbilityTuple, MongoQuery>>(ability);

export const AbilityProvider = ({ children }: { children: React.ReactNode }) => {
  const user = useStore((state) => state.user);

  useEffect(() => {
    user && updateAbility(ability, user);
  }, [user, ability]);

  return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>;
};

export const useAbility = (): MongoAbility<AbilityTuple, MongoQuery> => {
  const context = useContext(AbilityContext);

  if (!context) {
    throw new Error('useAbility must be used within AbilityProvider');
  }

  return context;
};

export const Can = createContextualCan(AbilityContext.Consumer);
