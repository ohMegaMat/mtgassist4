import React, { Component } from "react";

class SearchFilter extends Component {
  onSearch = () => {
    //   const results = [
    //     { id: 1, name: "Blightcaster" },
    //     { id: 2, name: "Catacomb Slug" }
    //   ];

    //    this.props.onSearch(results);
    fetch(
//      "https://api.magicthegathering.io/v1/cards?colors=black&setName=origins"
      "https://api.magicthegathering.io/v1/cards?set=ORI&page=4"
    )
      .then(response => response.json())
      .then(results => this.props.onSearch(results.cards));
  };

  render() {
    return (
      <div id="searchFilter">
        <button onClick={this.onSearch}>Search</button>
      </div>
    );
  }
}

export default SearchFilter;
