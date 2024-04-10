import { AdminEmailSearchBar } from "./admin-email-searchbar";
import { AdminHeaderCreateBtn } from "./admin-header-create-btn";
import { AdminHeaderOrderCombobox } from "./admin-header-order-combobox";

export const AdminHeader: React.FC<{}> = () => {
  return (
    <div className="flex items-end justify-between w-full flex-row">
      <div>
        <AdminEmailSearchBar />
      </div>
      <div className="flex items-center gap-2">
        <AdminHeaderOrderCombobox />
        <AdminHeaderCreateBtn />
      </div>
    </div>
  );
};
