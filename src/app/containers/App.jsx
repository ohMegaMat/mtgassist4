import React, { Component } from "react";
import SearchFilter from "../components/SearchFilter";
import SearchResults from "../components/SearchResults";
import { VIEW_STANDARD, VIEW_IMAGEONLY } from "../components/SearchResult"

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: [
        { id: 0, name: "Goblin" },
        { id: 1, name: "Zombie" },
        { id: 2, name: "Angel" },
        { id: 3, name: "Elf" }
      ]
    };
  }

  onSearch = results => {
    const cards = results.slice();
    this.setState({ cards });
  };

  render() {
    return (
      <div id="searchContainer">
        <SearchFilter onSearch={this.onSearch} />
        <SearchResults results={this.state.cards} view={VIEW_IMAGEONLY} />
      </div>
    );
  }
}

export default App;
