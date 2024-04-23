import { NoticeHeaderOrderCombobox } from "./notice-header-order-combobox";
import { NoticeIdSearchBar } from "./notice-id-search-bar";
import { NoticeAdminIdSearchBar } from "./notice-adminId-search-bar";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export const NoticeHeader: React.FC<{}> = () => {
  return (
    <div className="flex items-end w-full flex-row space-x-2 flex-wrap">
      <div className="flex items-center">
        <NoticeHeaderOrderCombobox />
      </div>
      <div className="flex space-x-2">
        <NoticeIdSearchBar />
        <NoticeAdminIdSearchBar />
        <Button asChild>
          <Link
            href={"/notices/create"}
            className="flex items-center space-x-1"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Create
            </span>
          </Link>
        </Button>
      </div>
    </div>
  );
};
