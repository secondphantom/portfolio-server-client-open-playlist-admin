import { Metadata } from "next";

import { cookies } from "next/headers";
import { ResponseBody } from "@/types/response.type";
import { redirect } from "next/navigation";
import { PageBreadcrumb } from "@/components/page-breadcrumb";
import NoticeTable from "./_components/notice-table";

import { NoticeHeader } from "./_components/notice-header";
import { ResponseCategoryGetListByQuery } from "@/server/spec/category/category.responses";
import { ResponseNoticeGetListByQuery } from "@/server/spec/notice/notice.responses";

export const metadata: Metadata = {
  title: "Notices",
};

const getPageData = async (searchParams: any) => {
  const urlSearchParams = new URLSearchParams(searchParams);

  const noticeListData = await fetch(
    `${process.env.API_SERVER_HOST}/api/notices?${urlSearchParams.toString()}`,
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
      return body as ResponseBody<ResponseNoticeGetListByQuery>;
    })
    .catch(() => ({ success: false, data: undefined }));
  return { noticeListData };
};

const Page = async ({ searchParams }: { searchParams: any }) => {
  const { noticeListData } = await getPageData(searchParams as any);

  if (!noticeListData.data) {
    redirect("/");
  }

  // if (!healthListData.success) {
  //   redirect("/");
  // }

  return (
    <div className="space-y-2">
      <div className="pl-2 pb-2">
        <PageBreadcrumb
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Notices" }]}
        />
      </div>
      <div className="pb-2 flex w-full justify-end">
        <NoticeHeader />
      </div>
      <NoticeTable
        searchParams={searchParams}
        noticeListData={noticeListData.data}
      />
    </div>
  );
};

export default Page;
