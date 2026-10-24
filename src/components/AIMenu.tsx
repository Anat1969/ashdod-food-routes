import { useEffect, useRef } from "react";

/** One action inside the A&I logo button. */
export interface MenuItem {
  label: string;
  hint?: string;
  pressed?: boolean;
  disabled?: boolean;
  onSelect: () => unknown;
}

interface MenuElement extends HTMLElement {
  items: MenuItem[];
  status: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "ai-menu": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        chat?: string;
        research?: string;
      };
    }
  }
}

interface Props {
  items?: MenuItem[];
  status?: string;
  chat?: string;
  research?: string;
}

/**
 * The A&I logo button (https://appofapp-gh.vercel.app/ai-menu.js, loaded in index.html).
 * Every editing and development action lives inside it, never loose in the top bar.
 */
export default function AIMenu({ items, status, chat, research }: Props) {
  const ref = useRef<MenuElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.items = items ?? [];
    el.status = status ?? "";
  }, [items, status]);

  return <ai-menu ref={ref} chat={chat} research={research} />;
}
