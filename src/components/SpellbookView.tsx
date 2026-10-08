import React from "react";
import { useSearchParams } from "react-router-dom";
import SpellbookApp from "../spellbook/App";

export function SpellbookView() {
  const [searchParams] = useSearchParams();
  const querySpell = searchParams.get("q") || searchParams.get("spell") || searchParams.get("search") || "";
  const spellId = searchParams.get("id") || undefined;

  return (
    <div className="w-full min-h-[calc(100vh-3.5rem)] flex flex-col bg-[#090d10] font-body text-slate-100">
      <SpellbookApp initialSearch={querySpell} initialSpellId={spellId} />
    </div>
  );
}

