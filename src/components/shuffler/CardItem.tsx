import Card from './types/card';

const CardItem = ({
  card,
  index,
  onEditClick,
  onDeleteClick,
}: {
  card: Card;
  index: number;
  onEditClick?: (card: Card) => void;
  onDeleteClick?: (card: Card) => void;
}) => {
  const { name } = card;

  return (
    <li key={name} className="card bg-neutral shadow-xl">
      <div className="card-body flex-row items-center justify-between p-4">
        <div className="flex gap-2 text-lg">
          <div>{index + 1}</div>
          <div>{name}</div>
        </div>
        <div className="card-actions">
          <button className="btn" onClick={() => onEditClick?.(card)}>
            Edit
          </button>
          <button
            className="btn btn-error"
            onClick={() => onDeleteClick?.(card)}
          >
            Delete
          </button>
        </div>
      </div>
    </li>
  );
};

export default CardItem;
