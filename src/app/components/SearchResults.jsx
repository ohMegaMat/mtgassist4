import React, { Component } from "react";
import SearchResult from "./SearchResult";

class SearchResults extends Component {
  render() {
	let { results } = this.props;
	let { view } = this.props;
    return (
      <ul id="searchResults" class="cardsList">
        {results.map(result => (
          <SearchResult
			result={result}
			view={view}
            id={"result_".concat(result.id)}
            key={"result_".concat(result.id)}
          />
        ))}
      </ul>
    );
  }
}

export default SearchResults;
