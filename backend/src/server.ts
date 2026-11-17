import cors from "cors";
import express, { type ErrorRequestHandler } from "express";
import { findAllPizzas, findPizzaById, createPizza, updatePizza, deletePizza, parsePizzaBody } from "./pizzas.js";

const PORT = 8080;

const app = express();

// Le front tourne sur un autre port (5173) : sans CORS, le navigateur
// bloquerait les appels. On en reparle dans la séance sécurité.
app.use(cors());
app.use(express.json());
//👉 Étape 1 : Bonus
/*
app.get("/api/pizzas", (request, response) => {
  response.json(findAllPizzas());
});*/
app.get("/api/pizzas", (request, response) => {
  const search = request.query.search;
  const pizzas = findAllPizzas();

  if (typeof search === "string") {
    const result = pizzas.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );

    return response.json(result);
  }

  return response.json(pizzas);
});

/*
app.get("/api/pizzas", (request, response) => {
    const search = request.query.search;

    const pizzas = listPizzas();

    if (typeof search === "string") {
        const result = pizzas.filter(p =>
            p.name.toLowerCase().includes(search.toLowerCase())
        );

        return response.json(result);
    }

    return response.json(pizzas);
});*/

// 👉 Étape 1 : GET /api/pizzas/:id
app.get("/api/pizzas/:id", (request, response) => {
  const id = Number(request.params.id)
  if(!Number.isInteger(id)){
    return response.status(400).json({
      error: " not integer"
    })

  }
  const pizza = findPizzaById(id)
  if(pizza === undefined){
    return response.status(404).json({
      error: "not found"
    })
  }
  return response.json(pizza)
})
// 👉 Étape 2 : POST, PUT et DELETE sur /api/pizzas
// POST
app.post("/api/pizzas", (request, response) => {
  const pizza = parsePizzaBody(request.body);

  if (pizza === null) {
    return response.status(400).json({ error: "Invalid pizza" });
  }

  // 👉 Bonus : Refusez deux pizzas de même nom avec un 409 Conflict
  const existe = findAllPizzas().some(p => p.name === pizza.name)
  if(existe){
    return response.status(409).json({ error: "Pizza existe" });
  }

  const newPizza = createPizza(pizza);
  

  return response.status(201).json(newPizza);
});

// PUT
app.put("/api/pizzas/:id", (request, response) => {
  const id = Number(request.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return response.status(404).json({ error: "Pizza not found" });
  }

  const pizza = parsePizzaBody(request.body);

  if (pizza === null) {
    return response.status(400).json({ error: "Invalid pizza" });
  }

  const updatedPizza = updatePizza(id, pizza);

  if (updatedPizza === undefined) {
    return response.status(404).json({ error: "Pizza not found" });
  }

  return response.status(200).json(updatedPizza);
});

// DELETE
app.delete("/api/pizzas/:id", (request, response) => {
  const id = Number(request.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return response.status(404).json({ error: "Pizza not found" });
  }

  const deleted = deletePizza(id);

  if (!deleted) {
    return response.status(404).json({ error: "Pizza not found" });
  }

  return response.status(204).send();
});

// 👉 Étape 4 : POST /api/orders

// Aucune route n'a répondu : c'est un 404.
app.use((request, response) => {
  response.status(404).json({ error: `Route inconnue : ${request.originalUrl}` });
});

// Express 5 attrape aussi les erreurs des handlers async et les envoie ici.
const handleError: ErrorRequestHandler = (error, request, response, next) => {
  console.error(error);
  response.status(500).json({ error: "Erreur serveur" });
};
app.use(handleError);

app.listen(PORT, () => {
  console.log(`🍕 API Pizzima sur http://localhost:${PORT}/api/pizzas`);
});
