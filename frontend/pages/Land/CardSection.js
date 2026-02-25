// // components/CardSection.jsx
import React from "react";
import Card from "./Card";

const CardSection = () => {
  const cards = [
    {
      title: "Professionalism",
      description:
        "MIT's primary vision is to plant the seed of professionalism amongst its students to ensure they lead a successful life. MIT firmly believes that people who act professionally, encourage their colleagues and friends to conduct themselves in a manner that supports success.",
    },
    {
      title: "Excellence",
      description:
        "The students of MIT are taught not to leave their performance at existing levels, but take it many steps higher. MIT strongly motivates its students to go that extra mile through learning new skills and improving existing ones, a trait that can only be achieved by striving for excellence.",
    },
    {
      title: "Respect",
      description:
        "The students of MIT should be friendly to each other through sharing a positive viewpoint where they should value others. Students in MIT do not impose their own will and never hesitate to take advice of others, a trait they have gained through showing and earning respect.",
    },
  ];

  return (
    <section className="bg-gray-100 py-12">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Welcome To Executive MIT
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <Card
              key={index}
              title={card.title}
              description={card.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CardSection;
