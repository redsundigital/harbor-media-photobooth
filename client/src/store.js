import React, { createContext, useContext, useReducer } from 'react';
import { generateId } from 'utils';

const StoreContext = createContext();

export const actionTypes = {
  ID: 'id',
};

const initialState = {
  pairId: generateId(6),
};

const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.ID:
      return {
        pairId: action.pairId,
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

export const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return <StoreContext.Provider value={{ state, dispatch }}>{children}</StoreContext.Provider>;
};

export const useStore = () => useContext(StoreContext);
