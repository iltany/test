import React from "react";
import "./styles.css";
import BookView from "./BookView";
import * as helpers from "./helpers";
import * as R from "ramda";

const Container = props => {
  const {
    data,
    tagFilter,
    statusFilter,
    cleanTagsFilter,
    values,
    tagFilterPush,
    moveBook
  } = props;

  if (!data) return <div className="empty">Loading...</div>;
  if (values[statusFilter].prev.length === 0)
    return <div className="empty">Empty</div>;

  const list = R.pipe(
    R.filter(helpers.filterByStateFn(values[statusFilter].prev)),
    R.filter(helpers.makeTagsFilterFn(tagFilter)),
    R.map(i => (
      <BookView
        key={i.id}
        book={i}
        values={values[statusFilter]}
        tagFilterPush={tagFilterPush}
        moveBook={moveBook}
      />
    ))
  )(data);

  return (
    <div className="container">
      {tagFilter.length > 0 && (
        <div className="tags_collection">
          <span>Filtered by tags: </span>
          <div className="tags">
            {tagFilter.map(tag => (
              <span className="tag">{"#" + tag}</span>
            ))}
            <div className="action action_name" onClick={cleanTagsFilter}>
              <div className="tab_name">(Clean)</div>
            </div>
          </div>
        </div>
      )}
      {list}
    </div>
  );
};

export default Container;
