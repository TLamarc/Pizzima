import { useEffect, useState } from "react";
import { getJson } from "./api.ts";
import type { Pizza } from "./types.ts";

export function usePizzas() {
  // Déplacez ici les useState et le useEffect d'App.tsx
    const [pizzas, setPizzas] = useState<Pizza[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getJson<Pizza[]>("/api/pizzas")
        .then(setPizzas)
        .catch((cause: unknown) => setError(String(cause)))
        .finally(() => setLoading(false));
    }, []);
  return { pizzas, loading, error };
}