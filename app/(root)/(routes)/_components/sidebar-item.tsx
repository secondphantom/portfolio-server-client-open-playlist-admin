"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";

type Props = {
  label: string;
  icon?: React.ReactNode;
  href: string;
  children?: React.ReactNode;
};

export const SidebarItem = (props: Props) => {
  const { href, label, icon, children } = props;
  const pathname = usePathname();
  const active = href === "/" ? pathname === href : pathname.startsWith(href);
  const [isOpen, setIsOpen] = useState(false);
  const isParent = !!children;
  return (
    <div className="w-full">
      <Button
        variant={active ? "secondary" : "ghost"}
        className="justify-start w-full cursor-pointer"
        asChild
      >
        {isParent ? (
          <div onClick={() => setIsOpen(!isOpen)}>
            {icon && icon}
            {label}
          </div>
        ) : (
          <Link href={href}>
            {icon && icon}
            {label}
          </Link>
        )}
      </Button>
      {children && (isOpen || active) && (
        <div className="w-full border p-1 rounded-sm">{children}</div>
      )}
    </div>
  );
};
