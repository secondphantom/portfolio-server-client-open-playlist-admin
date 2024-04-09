import { useRouter, useSearchParams } from "next/navigation";

export const useSafeRouter = (
  useInjectionRouter: typeof useRouter = useRouter
) => {
  const router = useInjectionRouter();
  const currentSearchParams = useSearchParams();

  const getHrefInfo = (href: string) => {
    let isInvalidUrl = false;
    let isSameOrigin = true;
    let isSamePath = true;
    let fullHref = undefined;
    if (!window) {
      return { fullHref: href, isInvalidUrl: true, isSameOrigin, isSamePath };
    }
    if (href.startsWith("./")) {
      fullHref = `${window.location.href.replace(
        /\/[^\/]+\/?$/,
        ""
      )}/${href.replace("./", "")}`;
    } else if (href.startsWith("/")) {
      fullHref = `${window.location.origin}${href}`;
    } else if (href.startsWith("http://") || href.startsWith("https://")) {
      fullHref = href;
    } else {
      fullHref = `${window.location.href.replace(/\/[^\/]+\/?$/, "")}/${href}`;
    }

    try {
      const url = new URL(fullHref);
      if (url.origin !== window.location.origin) {
        isSameOrigin = false;
      }
      if (url.pathname !== window.location.pathname) {
        isSamePath = false;
      }
    } catch {
      isInvalidUrl = true;
    }

    return { fullHref, isInvalidUrl, isSameOrigin, isSamePath };
  };

  const isWillRouting = (
    href: string,
    currentSearchParams: URLSearchParams
  ) => {
    if (!window) return false;
    const { fullHref, isInvalidUrl, isSameOrigin, isSamePath } =
      getHrefInfo(href);
    if (isInvalidUrl) return false;
    if (!isSamePath) return true;
    if (!isSameOrigin) return true;

    const searchParams = new URL(fullHref).searchParams;

    const uniqueKeySet = new Set(searchParams.keys());
    const currentUniqueKeySet = new Set(currentSearchParams.keys());

    if (uniqueKeySet.size !== currentUniqueKeySet.size) {
      return true;
    }

    for (const key of uniqueKeySet) {
      const currentValueSet = new Set(currentSearchParams.getAll(key));
      const valueSet = new Set(searchParams.getAll(key));

      if (currentValueSet.size !== valueSet.size) {
        return true;
      }

      for (const value of valueSet) {
        if (!currentValueSet.has(value)) return true;
      }
    }

    return false;
  };

  const safePush = async (...inputs: Parameters<typeof router.push>) => {
    const [href, _] = inputs;
    const isWillRoute = isWillRouting(href, currentSearchParams);

    if (!isWillRoute) {
      return;
    }

    return router.push(...inputs);
  };

  return {
    ...router,
    safePush,
  };
};
