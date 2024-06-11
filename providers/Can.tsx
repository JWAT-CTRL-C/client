import { createContext } from 'react';
import { createContextualCan } from '@casl/react';
import { AnyAbility } from '@casl/ability';

export const AbilityContext = createContext<AnyAbility>({} as AnyAbility);
export const Can = createContextualCan(AbilityContext.Consumer);
