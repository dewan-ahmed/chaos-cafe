import ChaosMenu from "@/components/ChaosMenu";
import { fetchChaosMenu } from "@/lib/chaos";

export const revalidate = 3600;

export default async function HomePage() {
  let error: string | null = null;
  let faults = [] as Awaited<ReturnType<typeof fetchChaosMenu>>;
  try {
    faults = await fetchChaosMenu();
  } catch (err) {
    error = err instanceof Error ? err.message : "The kitchen is closed.";
  }

  const kitchens = new Set(faults.map((f) => f.category)).size;

  return (
    <main className="report">
      <p className="eyebrow">Public Litmus chaos charts · no token</p>
      <h1>Chaos Café</h1>
      <p className="lede">
        A diner menu of publicly published chaos faults. Order with your eyes — we do not run
        experiments from here. No Harness account required.
      </p>
      {error ? <p className="error">{error}</p> : null}
      {faults.length > 0 ? (
        <>
          <section className="stats">
            <article>
              <span>Dishes</span>
              <b>{faults.length}</b>
            </article>
            <article>
              <span>Kitchens</span>
              <b>{kitchens}</b>
            </article>
            <article>
              <span>Token required</span>
              <b>None</b>
            </article>
            <article>
              <span>Spice level</span>
              <b>🔥🔥🔥</b>
            </article>
          </section>
          <ChaosMenu faults={faults} />
          <p className="fineprint">
            Sourced from{" "}
            <a href="https://github.com/litmuschaos/chaos-charts" target="_blank" rel="noreferrer">
              litmuschaos/chaos-charts
            </a>
            , the public catalog behind Harness Chaos Engineering.
          </p>
        </>
      ) : null}
    </main>
  );
}
