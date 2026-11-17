import type { Pizza } from "./types.ts";

type PizzaCardProps = {
  pizza: Pizza;
};

export default function PizzaCard({ pizza }: PizzaCardProps) {
    return (<li key={pizza.id} className="pizza">
        <span className="pizza-image">{pizza.image}</span>
        <h2>{pizza.name}</h2>
        <p>{pizza.description}</p>
        <strong>{pizza.price.toFixed(2)} €</strong>
    </li>)
}
