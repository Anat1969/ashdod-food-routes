import { useCallback, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const LIST_KEY = "nav_list";
const ROUTE_STACK_KEY = "nav_route_stack";

interface ListItem {
  id: string;
  label: string;
}

interface StoredList {
  items: ListItem[];
  basePath: string; // e.g. "/advertisement" or "/map"
  detailPrefix: string; // e.g. "/truck/"
  sortKey: string;
}

/**
 * Register a list of navigable items from a list page.
 * Call this on list pages (Advertisement, PublicMap, etc.)
 */
export function useRegisterList(
  items: ListItem[],
  basePath: string,
  detailPrefix: string = "/truck/",
  sortKey: string = "default"
) {
  useEffect(() => {
    if (items.length > 0) {
      const data: StoredList = { items, basePath, detailPrefix, sortKey };
      sessionStorage.setItem(LIST_KEY, JSON.stringify(data));
    }
  }, [items, basePath, detailPrefix, sortKey]);
}

/**
 * Use on detail pages (TruckProfile) to get prev/next navigation.
 */
export function useListNavigation(currentId: string | undefined) {
  const navigate = useNavigate();
  const location = useLocation();

  const stored = sessionStorage.getItem(LIST_KEY);
  const list: StoredList | null = stored ? JSON.parse(stored) : null;

  const currentIndex = list?.items.findIndex((i) => i.id === currentId) ?? -1;
  const hasList = list !== null && currentIndex >= 0;
  const hasPrev = hasList && currentIndex > 0;
  const hasNext = hasList && currentIndex < (list?.items.length ?? 0) - 1;
  const total = list?.items.length ?? 0;
  const position = currentIndex + 1;

  const goToPrev = useCallback(() => {
    if (hasPrev && list) {
      navigate(`${list.detailPrefix}${list.items[currentIndex - 1].id}`);
    }
  }, [hasPrev, list, currentIndex, navigate]);

  const goToNext = useCallback(() => {
    if (hasNext && list) {
      navigate(`${list.detailPrefix}${list.items[currentIndex + 1].id}`);
    }
  }, [hasNext, list, currentIndex, navigate]);

  const goToList = useCallback(() => {
    if (list) {
      navigate(list.basePath);
    }
  }, [list, navigate]);

  return {
    hasList,
    hasPrev,
    hasNext,
    goToPrev,
    goToNext,
    goToList,
    total,
    position,
    listLabel: list?.basePath ?? "",
    currentLabel: list?.items[currentIndex]?.label ?? "",
  };
}

/**
 * Track route history for "back to start of route" functionality.
 */
export function useRouteHistory() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const stack: string[] = JSON.parse(sessionStorage.getItem(ROUTE_STACK_KEY) || "[]");
    const current = location.pathname + location.search;
    // Don't add duplicates
    if (stack[stack.length - 1] !== current) {
      stack.push(current);
      // Keep max 50 entries
      if (stack.length > 50) stack.shift();
      sessionStorage.setItem(ROUTE_STACK_KEY, JSON.stringify(stack));
    }
  }, [location.pathname, location.search]);

  const routeStack: string[] = JSON.parse(sessionStorage.getItem(ROUTE_STACK_KEY) || "[]");

  const goToRouteStart = useCallback(() => {
    const stack: string[] = JSON.parse(sessionStorage.getItem(ROUTE_STACK_KEY) || "[]");
    if (stack.length > 0) {
      navigate(stack[0]);
    } else {
      navigate("/");
    }
  }, [navigate]);

  const goUpOneLevel = useCallback(() => {
    // Go to parent path segment
    const parts = location.pathname.split("/").filter(Boolean);
    if (parts.length > 1) {
      parts.pop();
      navigate("/" + parts.join("/"));
    } else {
      navigate("/");
    }
  }, [location.pathname, navigate]);

  return {
    routeStack,
    goToRouteStart,
    goUpOneLevel,
    stackLength: routeStack.length,
  };
}
