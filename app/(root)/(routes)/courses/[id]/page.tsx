import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ResponseBody } from "@/types/response.type";
import { PageBreadcrumb } from "@/components/page-breadcrumb";
import { CourseIdCard } from "../_components/course-id-card";
import { ResponseCourseGetById } from "@/server/spec/course/course.responses";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Course",
};

const getPageData = async (params: any) => {
  const courseData = await fetch(
    `${process.env.API_SERVER_HOST}/api/courses/${params.id}`,
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
      return body as ResponseBody<ResponseCourseGetById>;
    })
    .catch(() => ({ success: false, data: undefined }));
  return { courseData };
};

const Page = async ({ params }: { params: any }) => {
  const { courseData } = await getPageData(params);

  if (!courseData.data) {
    redirect("/");
  }

  return (
    <div className="space-y-2">
      <div className="pl-2 pb-2">
        <PageBreadcrumb
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Courses", href: "/courses" },
            { label: params.id },
          ]}
        />
      </div>
      <div className="grid grid-cols-1">
        <CourseIdCard courseData={courseData.data} />
      </div>
    </div>
  );
};

export default Page;
