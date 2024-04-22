import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ResponseBody } from "@/types/response.type";
import { PageBreadcrumb } from "@/components/page-breadcrumb";
import { NoticeIdCard } from "../_components/notice-id-card";
import { Metadata } from "next";
import { ResponseCategoryGetById } from "@/server/spec/category/category.responses";
import { ResponseNoticeGetById } from "@/server/spec/notice/notice.responses";

export const metadata: Metadata = {
  title: "Notice",
};

const getPageData = async (params: any) => {
  const noticeData = await fetch(
    `${process.env.API_SERVER_HOST}/api/notices/${params.id}`,
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
      return body as ResponseBody<ResponseNoticeGetById>;
    })
    .catch(() => ({ success: false, data: undefined }));
  return { noticeData };
};

const Page = async ({ params }: { params: any }) => {
  const { noticeData } = await getPageData(params);

  if (!noticeData.data) {
    redirect("/");
  }

  return (
    <div className="space-y-2">
      <div className="pl-2 pb-2">
        <PageBreadcrumb
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Notices", href: "/notices" },
            { label: params.id },
          ]}
        />
      </div>
      <div className="grid grid-cols-1">
        <NoticeIdCard noticeData={noticeData.data} />
      </div>
    </div>
  );
};

export default Page;
