import type { ReactNode } from "react";

type bullet_list_props = { children: ReactNode };

export const BulletList = ({ children }: bullet_list_props) => (
  <ul className="list-inside list-['❊_'] space-y-4 marker:text-gray-500">
    {children}
  </ul>
);
