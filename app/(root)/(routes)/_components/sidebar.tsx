import Link from "next/link";
import {
  AntennaIcon,
  AreaChartIcon,
  CircleGaugeIcon,
  HeartPulseIcon,
  Layers3Icon,
  MegaphoneIcon,
  NotebookPenIcon,
  ShieldIcon,
  UserCogIcon,
  UsersIcon,
  WrenchIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

import { SidebarItem } from "./sidebar-item";

type Props = {
  className?: string;
};

export const Sidebar = ({ className }: Props) => {
  return (
    <div
      className={cn(
        "flex h-full lg:w-[256px] lg:fixed left-0 top-0 px-4 border-r-2 flex-col",
        className
      )}
    >
      <Link href="/learn">
        <div className="pt-8 pl-4 pb-7 flex items-center gap-x-3">
          <div className="text-2xl font-extrabold  tracking-wide">
            Open Playlist Admin
          </div>
        </div>
      </Link>
      <div className="flex flex-col space-y-1 w-full">
        <SidebarItem
          label="Dashboard"
          href="/"
          icon={<CircleGaugeIcon className="w-5 h-5 mr-2" />}
        />
        <SidebarItem
          label="Health"
          href="/healths"
          icon={<HeartPulseIcon className="w-5 h-5 mr-2" />}
        />
        <SidebarItem
          label="Stats"
          href="/stats"
          icon={<AreaChartIcon className="w-5 h-5 mr-2" />}
        >
          <SidebarItem label="User" href="/stats/users" />
        </SidebarItem>
        <SidebarItem
          label="Notice"
          href="/notices"
          icon={<MegaphoneIcon className="w-5 h-5 mr-2" />}
        />
        <SidebarItem
          label="Admin"
          href="/admins"
          icon={<ShieldIcon className="w-5 h-5 mr-2" />}
        />
        <SidebarItem
          label="User"
          href="/users"
          icon={<UsersIcon className="w-5 h-5 mr-2" />}
        />
        <SidebarItem
          label="Course"
          href="/courses"
          icon={<NotebookPenIcon className="w-5 h-5 mr-2" />}
        />
        <SidebarItem
          label="Channel"
          href="/channels"
          icon={<AntennaIcon className="w-5 h-5 mr-2" />}
        />
        <SidebarItem
          label="Role"
          href="/roles"
          icon={<UserCogIcon className="w-5 h-5 mr-2" />}
        />
        <SidebarItem
          label="Category"
          href="/categories"
          icon={<Layers3Icon className="w-5 h-5 mr-2" />}
        />
        <SidebarItem
          label="Account"
          href="/account"
          icon={<WrenchIcon className="w-5 h-5 mr-2" />}
        >
          <SidebarItem label="Profile" href="/account/profile" />
          <SidebarItem label="Sessions" href="/account/sessions" />
        </SidebarItem>
      </div>
    </div>
  );
};
