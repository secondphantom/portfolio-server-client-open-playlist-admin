import { Metadata } from "next";

import { cookies } from "next/headers";
import { ResponseBody } from "@/types/response.type";
import { redirect } from "next/navigation";
import { PageBreadcrumb } from "@/components/page-breadcrumb";
import AnnouncementTable from "./_components/announcement-table";

import { AnnouncementHeader } from "./_components/announcement-header";
import { ResponseCategoryGetListByQuery } from "@/server/spec/category/category.responses";
import { ResponseAnnouncementGetListByQuery } from "@/server/spec/announcement/announcement.responses";

export const metadata: Metadata = {
  title: "Announcements",
};

const getPageData = async (searchParams: any) => {
  const urlSearchParams = new URLSearchParams(searchParams);

  const announcementListData = await fetch(
    `${
      process.env.API_SERVER_HOST
    }/api/announcements?${urlSearchParams.toString()}`,
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
      return body as ResponseBody<ResponseAnnouncementGetListByQuery>;
    })
    .catch(() => ({ success: false, data: undefined }));
  return { announcementListData };
};

const Page = async ({ searchParams }: { searchParams: any }) => {
  const { announcementListData } = await getPageData(searchParams as any);

  if (!announcementListData.data) {
    redirect("/");
  }

  // if (!healthListData.success) {
  //   redirect("/");
  // }

  return (
    <div className="space-y-2">
      <div className="pl-2 pb-2">
        <PageBreadcrumb
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Announcements" },
          ]}
        />
      </div>
      <div className="pb-2 flex w-full justify-end">
        <AnnouncementHeader />
      </div>
      <AnnouncementTable
        searchParams={searchParams}
        announcementListData={announcementListData.data}
      />
    </div>
  );
};

export default Page;
