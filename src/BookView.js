import React from "react";
import "./styles.css";

const BookView = props => {
  const { author, title, description, tags, id } = props.book;
  const { tagFilterPush, moveBook } = props;
  const { buttonName, symbol, prev, next } = props.values;

  return (
    <div className="book">
      <div className="author">{author}</div>
      <div className="book_name_action">
        <div className="book_name">{title}</div>
        <div className="action" onClick={() => moveBook(id, prev, next)}>
          <div className="action_name">{buttonName}</div>
          <span className="action_symbol">{String.fromCharCode(symbol)}</span>
        </div>
      </div>
      <div className="description">{description}</div>
      <div className="tags">
        {tags.map(i => (
          <span className="tag" key={i} onClick={() => tagFilterPush(i)}>
            {"#" + i}
          </span>
        ))}
      </div>
    </div>
  );
};

export default BookView;
