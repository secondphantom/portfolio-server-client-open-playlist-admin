"use client";

import * as z from "zod";
import { useRouter, useSearchParams } from "next/navigation";

import { useSafeRouter } from "@/hooks/use-safe-router";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const UserStatsHeader: React.FC<{ searchParams: any }> = ({
  searchParams,
}) => {
  const router = useSafeRouter(useRouter);
  const [query, setQuery] = useState({
    startDate: searchParams.startDate,
    endDate: searchParams.endDate,
    version: searchParams.version,
  });

  useEffect(() => {
    const urlSearchParams = new URLSearchParams();

    for (const [key, value] of Object.entries(query)) {
      urlSearchParams.set(key, value);
    }

    router.push(`/stats/users?${urlSearchParams.toString()}`);
  }, [query]);

  return (
    <div className="flex items-end w-full flex-row space-x-2 flex-wrap">
      <div className="flex space-x-2">
        <div>
          <Label className="pl-1">Start Date</Label>
          <Input
            type="datetime-local"
            value={new Date(query.startDate).toISOString().substring(0, 16)}
            onChange={(e) => {
              setQuery((prev) => {
                return { ...prev, startDate: e.target.value.substring(0, 10) };
              });
            }}
          />
        </div>
        <div>
          <Label className="pl-1">End Date</Label>
          <Input
            type="datetime-local"
            value={new Date(query.endDate).toISOString().substring(0, 16)}
            onChange={(e) => {
              setQuery((prev) => {
                return { ...prev, endDate: e.target.value.substring(0, 10) };
              });
            }}
          />
        </div>
        <div>
          <Label className="pl-1">Version</Label>
          <Input
            type="number"
            value={query.version}
            onChange={(e) => {
              setQuery((prev) => {
                return { ...prev, version: e.target.value };
              });
            }}
          />
        </div>
      </div>
    </div>
  );
};
