import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ResponseBody } from "@/types/response.type";
import { PageBreadcrumb } from "@/components/page-breadcrumb";
import { AdminIdCard } from "../_components/admin-id-card";
import { ResponseAdminGetById } from "@/server/spec/admin/admin.response";

const getPageData = async (params: any) => {
  const adminData = await fetch(
    `${process.env.API_SERVER_HOST}/api/admins/${params.id}`,
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
      return body as ResponseBody<ResponseAdminGetById>;
    })
    .catch(() => ({ success: false, data: undefined }));
  return { adminData };
};

const Page = async ({ params }: { params: any }) => {
  const { adminData } = await getPageData(params);

  if (!adminData.data) {
    redirect("/");
  }

  return (
    <div className="space-y-2">
      <div className="pl-2 pb-2">
        <PageBreadcrumb
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Admins", href: "/admins" },
            { label: params.id },
          ]}
        />
      </div>
      <AdminIdCard adminData={adminData.data} />
    </div>
  );
};

export default Page;
