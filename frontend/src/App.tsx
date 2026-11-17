import { useEffect, useState } from "react";
import { getJson } from "./api.ts";
import type { Pizza } from "./types.ts";
import PizzaCard from "./PizzaCard.tsx";

export default function App() {
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getJson<Pizza[]>("/api/pizzas")
      .then(setPizzas)
      .catch((cause: unknown) => setError(String(cause)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="app">
      <header>
        <h1>🍕 Pizzima</h1>
        <p>La pizza du BDE, livrée en amphi.</p>
      </header>

      <main>
        {loading && <p>Chargement…</p>}
        {error && (
          <p className="error">
            {error}
            <br />
            L'API est-elle démarrée sur le port 8080 ?
          </p>
        )}

        <ul className="pizzas">
          {pizzas.map((pizza) => (
            <PizzaCard key={pizza.id} pizza={pizza} />
          ))}
        </ul>
      </main>
    </div>
  );
}
