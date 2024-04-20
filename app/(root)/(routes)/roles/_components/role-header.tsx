import { RoleHeaderCreateBtn } from "./role-header-create-btn";
import { RoleHeaderOrderCombobox } from "./role-header-order-combobox";
import { RoleIdSearchBar } from "./role-id-search-bar";

export const RoleHeader: React.FC<{}> = () => {
  return (
    <div className="flex items-end w-full flex-row space-x-2 flex-wrap">
      <div className="flex items-center">
        <RoleHeaderOrderCombobox />
      </div>
      <div className="flex space-x-2">
        <RoleIdSearchBar />
        <RoleHeaderCreateBtn />
      </div>
    </div>
  );
};
