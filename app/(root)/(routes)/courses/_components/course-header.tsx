import { CourseVideoIdSearchBar } from "./course-videoId-search-bar";
import { CourseHeaderOrderCombobox } from "./course-header-order-combobox";
import { CourseChannelIdSearchBar } from "./course-channelId-search-bar";

export const CourseHeader: React.FC<{}> = () => {
  return (
    <div className="flex items-end w-full flex-row space-x-2 flex-wrap">
      <div className="flex items-center">
        <CourseHeaderOrderCombobox />
      </div>
      <div className="flex space-x-2">
        <CourseVideoIdSearchBar />
        <CourseChannelIdSearchBar />
      </div>
    </div>
  );
};
