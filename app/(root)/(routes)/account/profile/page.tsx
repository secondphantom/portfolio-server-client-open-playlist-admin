import { Metadata } from "next";

import { PageBreadcrumb } from "@/components/page-breadcrumb";
import { ProfileCard } from "./_components/profile-card";

export const metadata: Metadata = {
  title: "Sessions",
};

const Page = async ({ searchParams }: { searchParams: any }) => {
  // if (!healthListData.success) {
  //   redirect("/");
  // }

  return (
    <div className="space-y-2">
      <div className="pl-2 pb-2">
        <PageBreadcrumb
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Profile" }]}
        />
      </div>
      <ProfileCard />
    </div>
  );
};

export default Page;
