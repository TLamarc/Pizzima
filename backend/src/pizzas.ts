import { createStore } from "./store.js";

export type Pizza = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
};

const store = createStore<Pizza>("pizzas.json");

export function findAllPizzas(): Pizza[] {
  return store.all();
}

// 👉 Étape 1 : findPizzaById(id) — renvoie la pizza ou undefined
export function findPizzaById(id: number) : Pizza | undefined{
  const pizza = store.all().find(p => p.id === id)
  return pizza
}

// 👉 Étape 2 : createPizza / updatePizza / deletePizza
//    Pensez à appeler store.save(...) pour persister vos changements.
export function createPizza(pizza: Omit<Pizza, "id">): Pizza {
  // Générer un id (indice : le plus grand id existant + 1, et 1 si le store est vide)
  // Ajouter la pizza, appeler store.save(...), retourner la pizza créée
  const pizzas = store.all();

  let newId = 1;

  if (pizzas.length > 0) {
    const ids = pizzas.map(p => p.id);
    const maxId = Math.max(...ids);
    newId = maxId + 1;
  }

  const newPizza: Pizza = {...pizza, id: newId
  };
  pizzas.push(newPizza);
  store.save(pizzas);

  return newPizza;
}

export function updatePizza(id: number, pizza: Omit<Pizza, "id">): Pizza | undefined {
  // undefined si l'id n'existe pas
  const pizzas = store.all();

  const existing = pizzas.find(p => p.id === id);

  if (!existing) {
    return undefined;
  }

  const updatedPizza: Pizza = {...pizza, id};

  const updatedPizzas = pizzas.map(p => p.id === id ? updatedPizza : p);

  store.save(updatedPizzas);

  return updatedPizza;
}

export function deletePizza(id: number): boolean {
  // true si quelque chose a été supprimé, false sinon
  const pizzas = store.all();

  const filteredPizzas = pizzas.filter(p => p.id !== id);

  if (filteredPizzas.length === pizzas.length) {
    return false;
  }

  store.save(filteredPizzas);

  return true;
}
// Partez de unknown, pas de any
export function parsePizzaBody(body: unknown): Omit<Pizza, "id"> | null {
  // Retourner null si ce n'est pas un objet avec :
  if (typeof body !== "object" || body === null) {
    return null;
  }
  //   name: string non vide
  //   description: string
  //   price: number > 0
  //   image: string

  if (
    !("name" in body) ||
    typeof body.name !== "string" ||
    body.name.trim() === "" ||
    !("description" in body) ||
    typeof body.description !== "string" ||
    !("price" in body) ||
    typeof body.price !== "number" ||
    !Number.isFinite(body.price) ||
    body.price <= 0 ||
    !("image" in body) ||
    typeof body.image !== "string"
  ) {
    return null;
  }

  return {
    name: body.name,
    description: body.description,
    price: body.price,
    image: body.image
  };

}