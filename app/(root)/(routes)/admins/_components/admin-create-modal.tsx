"use client";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  complete: () => Promise<void>;
};

export const AdminCreateModal: React.FC<Props> = ({
  isOpen,
  setIsOpen,
  complete,
}) => {
  return (
    <Modal
      title="Create New Admin"
      // isOpen={isOpen}
      isOpen={true}
      onClose={() => setIsOpen(false)}
    >
      <div className="w-full flex justify-end space-x-2">
        <Button
          variant={"ghost"}
          onClick={async () => {
            await complete();
            setIsOpen(false);
          }}
        >
          Complete
        </Button>
        <Button onClick={() => setIsOpen(false)}>Close</Button>
      </div>
    </Modal>
  );
};
