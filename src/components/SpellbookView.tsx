import React from "react";
import { useSearchParams } from "react-router-dom";
import { SpellbookApp } from "../spellbook/SpellbookApp";

export function SpellbookView() {
  const [searchParams] = useSearchParams();
  const querySpell = searchParams.get("q") || searchParams.get("spell") || searchParams.get("search") || "";

  return (
    <div className="relative w-full min-h-[calc(100vh-3.5rem)] flex flex-col bg-[#0c1013] text-slate-100 font-body">
      <SpellbookApp initialSearch={querySpell} />
    </div>
  );
}

export default SpellbookView;
