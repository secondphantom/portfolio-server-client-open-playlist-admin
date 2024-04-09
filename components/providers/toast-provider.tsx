"use client";

import { Toaster } from "react-hot-toast";

export const ToastProvider = () => {
  return (
    <>
      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 1200,
        }}
      />
    </>
  );
};
