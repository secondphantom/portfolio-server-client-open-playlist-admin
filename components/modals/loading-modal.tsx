"use client";
import { Modal } from "@/components/ui/modal";
import { useLoadingModalStore } from "@/hooks/use-loading-modal-store";
import { Spinner } from "../spinner";

export const LoadingModal = () => {
  const store = useLoadingModalStore();

  return (
    <Modal
      // isOpen={true}
      isOpen={store.isOpen}
      onClose={store.onClose}
      className="w-fit shadow-none border-0 focus:outline-none bg-transparent"
      disableClose={true}
    >
      <div className="mx-auto">
        <Spinner size={"lg"} />
      </div>
    </Modal>
  );
};
