"use client";

import { useState } from "react";
import { ICON_MAP, ICON_NAMES } from "@/lib/icon-map";

export function IconPicker({
  name,
  defaultValue = "compass",
}: {
  name: string;
  defaultValue?: string;
}) {
  const [selected, setSelected] = useState(defaultValue);

  return (
    <div className="flex flex-col gap-1.5">
      <input type="hidden" name={name} value={selected} />
      <div className="grid grid-cols-8 gap-1.5 rounded-lg border border-[#e7e2d6] p-2 sm:grid-cols-10">
        {ICON_NAMES.map((iconName) => {
          const Icon = ICON_MAP[iconName];
          const active = iconName === selected;
          return (
            <button
              key={iconName}
              type="button"
              title={iconName}
              onClick={() => setSelected(iconName)}
              className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
                active
                  ? "bg-[#df9c28] text-[#263f40]"
                  : "text-[#5c6e6f] hover:bg-[#f7f8f8]"
              }`}
            >
              <Icon size={17} strokeWidth={2} />
            </button>
          );
        })}
      </div>
      <p className="text-xs text-[#5c6e6f]">Selecionado: {selected}</p>
    </div>
  );
}
