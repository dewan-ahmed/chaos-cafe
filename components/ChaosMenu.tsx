"use client";

import { useMemo, useState } from "react";
import type { ChaosFault } from "@/lib/chaos";

function pickSpecial(faults: ChaosFault[], seed = new Date().toISOString().slice(0, 10)) {
  if (faults.length === 0) return null;
  const hash = [...seed].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  return faults[hash % faults.length];
}

export default function ChaosMenu({ faults }: { faults: ChaosFault[] }) {
  const daily = useMemo(() => pickSpecial(faults), [faults]);
  const [special, setSpecial] = useState<ChaosFault | null>(daily);

  const byCategory = useMemo(() => {
    const map = new Map<string, ChaosFault[]>();
    for (const fault of faults) {
      const list = map.get(fault.category) ?? [];
      list.push(fault);
      map.set(fault.category, list);
    }
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [faults]);

  function spin() {
    if (faults.length === 0) return;
    setSpecial(faults[Math.floor(Math.random() * faults.length)]);
  }

  return (
    <>
      {special ? (
        <section className="specials">
          <p className="eyebrow">Soup of the day</p>
          <h2>{special.name}</h2>
          <p>
            A {special.category} fault, plated from the public Litmus chaos charts. Not served to
            your cluster — this café is menus only.
          </p>
          <div className="topbar-actions">
            <a className="ghost" href={special.href} target="_blank" rel="noreferrer">
              See the recipe
            </a>
            <button type="button" className="ghost" onClick={spin}>
              Surprise me
            </button>
          </div>
        </section>
      ) : null}

      {byCategory.map(([category, items]) => (
        <section key={category}>
          <h2>{category} kitchen</h2>
          <ul className="forecast cafe-grid">
            {items.map((fault) => (
              <li key={`${fault.category}-${fault.name}`} className="tile">
                <div>
                  <strong>
                    <a href={fault.href} target="_blank" rel="noreferrer">
                      {fault.name}
                    </a>
                  </strong>
                  <p>Public chaos fault · {category}</p>
                </div>
                <span>🔥</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}
