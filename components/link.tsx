"use client";

import NextLink, { LinkProps } from "next/link";
import { forwardRef } from "react";
import { linkClicked as progressBarLinkClicked } from "nextjs13-progress";

export const Link = forwardRef<
  HTMLAnchorElement,
  React.PropsWithChildren<LinkProps & { className?: string }>
>(({ onClick, children, className, ...rest }, ref) => (
  <NextLink
    onClick={(event) => {
      if (onClick) {
        // fire only the existing event only
        onClick(event);
      } else {
        // fire the progressbar event
        progressBarLinkClicked(event);
      }
    }}
    className={className}
    prefetch={false}
    {...rest}
    ref={ref}
  >
    {children}
  </NextLink>
));
