import CardItem from './CardItem';
import Card from './types/card';

const CardsList = ({
  cards,
  onEditClick,
  onDeleteClick,
  isLoading,
  errMessage,
}: {
  cards: Card[];
  isLoading?: boolean;
  errMessage?: string;
  onEditClick?: (card: Card) => void;
  onDeleteClick?: (card: Card) => void;
}) => {
  return isLoading ? (
    <div>Loading cards...</div>
  ) : errMessage ? (
    <div>Could not get cards from the server. (Error: {errMessage})</div>
  ) : (
    <ul className="flex flex-col gap-4">
      {cards.length === 0 ? (
        <li>There are no cards yet.</li>
      ) : (
        cards.map((card, index) => (
          <CardItem
            key={card.name}
            card={card}
            index={index}
            onDeleteClick={onDeleteClick}
            onEditClick={onEditClick}
          />
        ))
      )}
    </ul>
  );
};

export default CardsList;
