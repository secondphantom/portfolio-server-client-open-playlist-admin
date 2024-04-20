import { Metadata } from "next";

import { cookies } from "next/headers";
import { ResponseBody } from "@/types/response.type";
import { redirect } from "next/navigation";
import { ResponseHealthGetListByQuery } from "@/server/spec/health/health.responses";
import { PageBreadcrumb } from "@/components/page-breadcrumb";
import CourseTable from "./_components/course-table";

import { CourseHeader } from "./_components/course-header";
import { ResponseUserGetListByQuery } from "@/server/spec/user/user.responses";
import { ResponseCourseGetListByQuery } from "@/server/spec/course/course.responses";

export const metadata: Metadata = {
  title: "Courses",
};

const getPageData = async (searchParams: any) => {
  const urlSearchParams = new URLSearchParams(searchParams);

  const courseListData = await fetch(
    `${process.env.API_SERVER_HOST}/api/courses?${urlSearchParams.toString()}`,
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
      return body as ResponseBody<ResponseCourseGetListByQuery>;
    })
    .catch(() => ({ success: false, data: undefined }));
  return { courseListData };
};

const Page = async ({ searchParams }: { searchParams: any }) => {
  const { courseListData } = await getPageData(searchParams as any);

  if (!courseListData.data) {
    redirect("/");
  }

  // if (!healthListData.success) {
  //   redirect("/");
  // }

  return (
    <div className="space-y-2">
      <div className="pl-2 pb-2">
        <PageBreadcrumb
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Courses" }]}
        />
      </div>
      <div className="pb-2 flex w-full justify-end">
        <CourseHeader />
      </div>
      <CourseTable
        searchParams={searchParams}
        courseListData={courseListData.data}
      />
    </div>
  );
};

export default Page;
