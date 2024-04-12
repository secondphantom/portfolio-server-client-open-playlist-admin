import { UserEmailSearchBar } from "./user-email-search-bar";
import { UserHeaderOrderCombobox } from "./user-header-order-combobox";

export const UserHeader: React.FC<{}> = () => {
  return (
    <div className="flex items-end w-full flex-row space-x-2">
      <div className="flex items-center">
        <UserHeaderOrderCombobox />
      </div>
      <div>
        <UserEmailSearchBar />
      </div>
    </div>
  );
};
