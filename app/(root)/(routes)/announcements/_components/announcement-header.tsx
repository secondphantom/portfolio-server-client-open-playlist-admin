import { AnnouncementHeaderOrderCombobox } from "./announcement-header-order-combobox";
import { AnnouncementIdSearchBar } from "./announcement-id-search-bar";
import { AnnouncementAdminIdSearchBar } from "./announcement-adminId-search-bar";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export const AnnouncementHeader: React.FC<{}> = () => {
  return (
    <div className="flex items-end w-full flex-row space-x-2 flex-wrap">
      <div className="flex items-center">
        <AnnouncementHeaderOrderCombobox />
      </div>
      <div className="flex space-x-2">
        <AnnouncementIdSearchBar />
        <AnnouncementAdminIdSearchBar />
        <Button asChild>
          <Link
            href={"/announcements/create"}
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
