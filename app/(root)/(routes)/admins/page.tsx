import { Metadata } from "next";

import { cookies } from "next/headers";
import { ResponseBody } from "@/types/response.type";
import { redirect } from "next/navigation";
import { ResponseHealthGetListByQuery } from "@/server/spec/health/health.responses";
import { PageBreadcrumb } from "@/components/page-breadcrumb";
import AdminTable from "./_components/admin-table";
import { ResponseAdminGetListByQuery } from "@/server/spec/admin/admin.response";
import { AdminHeader } from "./_components/admin-header";

export const metadata: Metadata = {
  title: "Admins",
};

const getPageData = async (searchParams: any) => {
  const urlSearchParams = new URLSearchParams(searchParams);

  const adminListData = await fetch(
    `${process.env.API_SERVER_HOST}/api/admins?${urlSearchParams.toString()}`,
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
      return body as ResponseBody<ResponseAdminGetListByQuery>;
    })
    .catch(() => ({ success: false, data: undefined }));
  return { adminListData };
};

const Page = async ({ searchParams }: { searchParams: any }) => {
  const { adminListData } = await getPageData(searchParams as any);

  if (!adminListData.data) {
    redirect("/");
  }

  // if (!healthListData.success) {
  //   redirect("/");
  // }

  return (
    <div className="space-y-2">
      <div className="pl-2 pb-2">
        <PageBreadcrumb
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Admins" }]}
        />
      </div>
      <div className="pb-2 flex w-full justify-end">
        <AdminHeader />
      </div>
      <AdminTable
        searchParams={searchParams}
        adminListData={adminListData.data}
      />
    </div>
  );
};

export default Page;
