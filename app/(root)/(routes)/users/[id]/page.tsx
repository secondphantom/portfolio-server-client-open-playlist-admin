import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ResponseBody } from "@/types/response.type";
import { PageBreadcrumb } from "@/components/page-breadcrumb";
import { UserIdProfileCard } from "../_components/user-id-profile-card";
import { ResponseUserGetById } from "@/server/spec/user/user.responses";
import { UserIdCreditCard } from "../_components/user-id-credit-card";

const getPageData = async (params: any) => {
  const userData = await fetch(
    `${process.env.API_SERVER_HOST}/api/users/${params.id}`,
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
      return body as ResponseBody<ResponseUserGetById>;
    })
    .catch(() => ({ success: false, data: undefined }));
  return { userData };
};

const Page = async ({ params }: { params: any }) => {
  const { userData } = await getPageData(params);

  if (!userData.data) {
    redirect("/");
  }

  return (
    <div className="space-y-2">
      <div className="pl-2 pb-2">
        <PageBreadcrumb
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Users", href: "/users" },
            { label: params.id },
          ]}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UserIdProfileCard userData={userData.data} />
        <UserIdCreditCard userData={userData.data} />
      </div>
    </div>
  );
};

export default Page;
