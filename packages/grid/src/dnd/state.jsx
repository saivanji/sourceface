import React, { createContext, useRef } from "react";

export const context = createContext({});

export const Provider = ({ children }) => {
  const ref = useRef({});

  return (
    <context.Provider
      value={{
        dragStart: type => {
          ref.current.type = type;
        },
        dragEnd: () => {
          ref.current = {};
        },
        provide: callbacks => {
          let result = {};

          for (let key of Object.keys(callbacks)) {
            result[key] = (...args) => {
              const prev = ref.current.payload;
              ref.current.payload = Object.assign(
                {},
                prev,
                callbacks[key](prev, ...args)
              );
            };
          }

          return result;
        },
        type: () => ref.current.type
      }}
    >
      {children}
    </context.Provider>
  );
};
