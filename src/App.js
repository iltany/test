import React, { Component } from "react";
import "./styles.css";
import * as helpers from "./helpers";
import Container from "./Container";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null, // [{
      //  "id": "String",
      //  "author": "String",
      //  "title": "String",
      //  "description": "String",
      //  "tags": [String]
      //}]
      tagFilter: [], //active tags
      statusFilter: "toread", // String: toread(default)/inprogress/done
      toRead: [], //IDs of books by it status
      inProgress: [], //same
      done: [], //same
      bookStates: {} //{"id: "state"} // String: toread(default)/inprogress/done
    };
  }

  componentDidMount() {
    let bookStorage = JSON.parse(window.localStorage.getItem("bookStorage"));

    //URL parsing
    const status = helpers.urlParse(document.location.search);
    const tags = status.tags ? status.tags : [];
    const tab = status.tab ? status.tab : "toread";

    this.setState({
      statusFilter: tab,
      tagFilter: tags
    });

    if (bookStorage) {
      this.setState({
        toRead: bookStorage.toRead,
        inProgress: bookStorage.inProgress,
        done: bookStorage.done
      });
    }

    if (!this.state.data) {
      let self = this;
      fetch("../data.json")
        .then(function(response) {
          return response.json();
        })
        .then(function(result) {
          let toReadIDs = !bookStorage
            ? result.items.map(item => item.id)
            : bookStorage.toRead;
          return self.setState({
            data: result.items,
            toRead: toReadIDs
          });
        });
    }
  }

  //change state.tagFilter throught URL
  tagFilterPush = tagName => {
    if (this.state.tagFilter.indexOf(tagName) === -1) {
      let tagsArr = [tagName, ...this.state.tagFilter];
      window.history.pushState(
        null,
        null,
        helpers.makeURL(
          document.location.origin,
          this.state.statusFilter,
          tagsArr
        )
      );
      this.setState({ tagFilter: tagsArr });
    }
  };

  //change state.statusFilter throught URL
  changeTab = selector => {
    const { toRead, inProgress, done } = this.state;
    let bookStorage = { toRead, inProgress, done };
    window.localStorage.setItem("bookStorage", JSON.stringify(bookStorage));
    window.history.pushState(
      null,
      null,
      helpers.makeURL(document.location.origin, selector, this.state.tagFilter)
    );
    this.setState({ statusFilter: selector });
  };

  cleanTagsFilter = () => {
    window.history.pushState(
      null,
      null,
      helpers.makeURL(document.location.origin, this.state.statusFilter)
    );
    this.setState({ tagFilter: [] });
  };

  toReadAgain = bookID => {
    let arr1 = [...this.state.done];
    let arr2 = [...this.state.toRead];
    arr1.splice(arr1.indexOf(bookID), 1);
    arr2.push(bookID);
    this.setState({ done: arr1, toRead: arr2 });
  };

  moveBook = (bookID, prevArr, nextArr) => {
    let arr1 = [...prevArr];
    let arr2 = [...nextArr];
    arr1.splice(prevArr.indexOf(bookID), 1);
    arr2.push(bookID);

    if (this.state.statusFilter === "toread") {
      return this.setState({ toRead: arr1, inProgress: arr2 });
    }

    if (this.state.statusFilter === "inprogress") {
      this.setState({ inProgress: arr1, done: arr2 });
    }

    if (this.state.statusFilter === "done") {
      this.setState({ done: arr1, toRead: arr2 });
    }
  };

  render() {
    const {
      tagFilter,
      statusFilter,
      data,
      toRead,
      inProgress,
      done
    } = this.state;

    const values = {
      toread: {
        tabName: "To read",
        buttonName: "start reading",
        symbol: 8594,
        prev: toRead,
        next: inProgress
      },
      inprogress: {
        tabName: "In progress",
        buttonName: "finish reading",
        symbol: 8594,
        prev: inProgress,
        next: done
      },
      done: {
        tabName: "Done",
        buttonName: 'return in to "read"',
        symbol: 8629,
        prev: done,
        next: toRead
      }
    };

    return (
      <div className="wrapper">
        <div className="tabs">
          {Object.keys(values).map(status => (
            <div
              className={
                status === this.state.statusFilter ? "tab  tab_active" : "tab"
              }
              onClick={() => this.changeTab(status)}
              key={status}
            >
              <div className="tab_name">
                {values[status].tabName}({values[status].prev.length})
              </div>
            </div>
          ))}
        </div>

        <Container
          data={data}
          statusFilter={statusFilter}
          tagFilter={tagFilter}
          tagFilterPush={this.tagFilterPush}
          cleanTagsFilter={this.cleanTagsFilter}
          moveBook={this.moveBook}
          values={values}
        />
      </div>
    );
  }
}
