"use client";
import { UserStatsHeaderQuery } from "./user-stats-header-query";
import { UserStatsHeaderCreateBtn } from "./user-stats-header-create-btn";

export const UserStatsHeader: React.FC<{ searchParams: any }> = ({
  searchParams,
}) => {
  return (
    <div className="flex items-end w-full flex-row gap-1 flex-wrap">
      <UserStatsHeaderQuery searchParams={searchParams} />
      <UserStatsHeaderCreateBtn />
    </div>
  );
};
