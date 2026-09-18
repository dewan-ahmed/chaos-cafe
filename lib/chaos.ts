export type ChaosFault = {
  name: string;
  category: string;
  href: string;
};

const GITHUB_HEADERS = {
  Accept: "application/vnd.github+json",
  "User-Agent": "chaos-cafe",
};

export async function fetchChaosMenu(): Promise<ChaosFault[]> {
  const catsRes = await fetch(
    "https://api.github.com/repos/litmuschaos/chaos-charts/contents/faults",
    { headers: GITHUB_HEADERS, next: { revalidate: 3600 } },
  );
  if (!catsRes.ok) throw new Error("The café is out of chaos charts.");
  const categories = (await catsRes.json()) as { name?: string; type?: string }[];
  const dirs = categories.filter((c) => c.type === "dir" && c.name);

  const groups = await Promise.all(
    dirs.map(async (dir) => {
      const res = await fetch(
        `https://api.github.com/repos/litmuschaos/chaos-charts/contents/faults/${dir.name}`,
        { headers: GITHUB_HEADERS, next: { revalidate: 3600 } },
      );
      if (!res.ok) return [] as ChaosFault[];
      const entries = (await res.json()) as { name?: string; type?: string }[];
      return entries
        .filter((entry) => entry.type === "dir" && entry.name && entry.name !== "icons")
        .map((entry) => ({
          name: (entry.name || "").replace(/-/g, " "),
          category: dir.name || "kitchen",
          href: `https://github.com/litmuschaos/chaos-charts/tree/master/faults/${dir.name}/${entry.name}`,
        }));
    }),
  );

  return groups.flat();
}
