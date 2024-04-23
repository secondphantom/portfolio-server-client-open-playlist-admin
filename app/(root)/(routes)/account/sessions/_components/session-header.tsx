import { SessionHeaderOrderCombobox } from "./session-header-order-combobox";

export const SessionHeader: React.FC<{}> = () => {
  return (
    <div className="flex items-end w-full flex-row space-x-2 flex-wrap">
      <div className="flex items-center">
        <SessionHeaderOrderCombobox />
      </div>
    </div>
  );
};
