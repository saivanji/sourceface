import React from "react";
import Layout from "../Layout";

export const Root = ({
  settings: [title],
  state: { isOpened },
  onStateChange,
}) => {
  const close = () => {
    onStateChange((state) => ({ ...state, isOpened: false }));
  };

  return (
    isOpened && (
      <div
        className="fixed top-0 left-0 w-full h-full flex items-center justify-center"
        style={{ backgroundColor: "rgba(0, 0, 0, .25)" }}
      >
        <div className="bg-white rounded p-3 max-w-xl w-full">
          <div className="w-full pb-2 mb-2 border-b border-gray-300 flex items-center">
            <span className="text-md font-semibold">{title}</span>
            <Close className="ml-auto cursor-pointer" onClick={close} />
          </div>
          <Layout />
        </div>
      </div>
    )
  );
};

function Close({ className, onClick }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="18"
      height="18"
      onClick={onClick}
    >
      <path fill="none" d="M0 0h24v24H0z" />
      <path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z" />
    </svg>
  );
}

Root.settings = ["title"];

export const initialState = {
  isOpened: false,
};

export const functions = {
  open: {
    call: (_args, transition) => {
      transition((state) => ({ ...state, isOpened: true }));
    },
  },
  close: {
    call: (_args, transition) => {
      transition((state) => ({ ...state, isOpened: false }));
    },
  },
};
