import { PageBreadcrumb } from "@/components/page-breadcrumb";
import { Metadata } from "next";
import { NoticeCreateCard } from "../_components/notice-new-card";

export const metadata: Metadata = {
  title: "Notice",
};

const Page = async ({ params }: { params: any }) => {
  return (
    <div className="space-y-2">
      <div className="pl-2 pb-2">
        <PageBreadcrumb
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Notices", href: "/notices" },
            { label: "New" },
          ]}
        />
      </div>
      <div className="grid grid-cols-1">
        <NoticeCreateCard />
      </div>
    </div>
  );
};

export default Page;
