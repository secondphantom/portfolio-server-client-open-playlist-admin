import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ResponseBody } from "@/types/response.type";
import { PageBreadcrumb } from "@/components/page-breadcrumb";
import { AnnouncementIdCard } from "../_components/announcement-id-card";
import { Metadata } from "next";
import { ResponseCategoryGetById } from "@/server/spec/category/category.responses";
import { ResponseAnnouncementGetById } from "@/server/spec/announcement/announcement.responses";

export const metadata: Metadata = {
  title: "Announcement",
};

const getPageData = async (params: any) => {
  const announcementData = await fetch(
    `${process.env.API_SERVER_HOST}/api/announcements/${params.id}`,
    {
      method: "GET",
      headers: {
        Cookie: cookies().toString(),
      },
    }
  )
    .then(async (res) => {
      if (res.status >= 300) throw new Error();
      const body = await res.json();
      ``;
      return body as ResponseBody<ResponseAnnouncementGetById>;
    })
    .catch(() => ({ success: false, data: undefined }));
  return { announcementData };
};

const Page = async ({ params }: { params: any }) => {
  const { announcementData } = await getPageData(params);

  if (!announcementData.data) {
    redirect("/");
  }

  return (
    <div className="space-y-2">
      <div className="pl-2 pb-2">
        <PageBreadcrumb
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Announcements", href: "/announcements" },
            { label: params.id },
          ]}
        />
      </div>
      <div className="grid grid-cols-1">
        <AnnouncementIdCard announcementData={announcementData.data} />
      </div>
    </div>
  );
};

export default Page;
