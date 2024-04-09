"use client";

import { useEffect, useState } from "react";

import { useLoadingModalStore } from "@/hooks/use-loading-modal-store";
import { LoadingModal } from "../modals/loading-modal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { onClose, isLoading, onOpen } = useLoadingModalStore();

  useEffect(() => {
    if (isLoading) {
      onOpen();
      return;
    }
    onClose();
    return;
  }, [isLoading]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <LoadingModal />
    </>
  );
};
