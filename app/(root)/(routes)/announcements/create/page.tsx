import { PageBreadcrumb } from "@/components/page-breadcrumb";
import { Metadata } from "next";
import { AnnouncementCreateCard } from "../_components/announcement-new-card";

export const metadata: Metadata = {
  title: "Announcement",
};

const Page = async ({ params }: { params: any }) => {
  return (
    <div className="space-y-2">
      <div className="pl-2 pb-2">
        <PageBreadcrumb
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Announcements", href: "/announcements" },
            { label: "New" },
          ]}
        />
      </div>
      <div className="grid grid-cols-1">
        <AnnouncementCreateCard />
      </div>
    </div>
  );
};

export default Page;
