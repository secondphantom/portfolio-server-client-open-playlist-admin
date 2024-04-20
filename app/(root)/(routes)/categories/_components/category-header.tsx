import { CategoryHeaderCreateBtn } from "./category-header-create-btn";
import { CategoryHeaderOrderCombobox } from "./category-header-order-combobox";
import { CategoryIdSearchBar } from "./category-id-search-bar";

export const CategoryHeader: React.FC<{}> = () => {
  return (
    <div className="flex items-end w-full flex-row space-x-2 flex-wrap">
      <div className="flex items-center">
        <CategoryHeaderOrderCombobox />
      </div>
      <div className="flex space-x-2">
        <CategoryIdSearchBar />
        <CategoryHeaderCreateBtn />
      </div>
    </div>
  );
};
