import React, { Component } from "react";

export const VIEW_STANDARD = 0;
export const VIEW_IMAGEONLY = 1;

class SearchResult extends Component {
  getPower = card => {
    if (typeof card !== "undefined" && typeof card.types !== "undefined") {
      if (card.types[0] === "Creature") {
        return (
          <span class="cardStrenght">
            {card.power}/{card.toughness}
          </span>
        );
      } else if (card.types[0] === "Planeswalker") {
        return <span class="cardStrenght">{card.loyalty}</span>;
      }
    }
    return "";
  };

  renderStandard = result => {
	return (
      <li id={result.id} key={result.id} class="cardResult border border-light">
        <img src={result.imageUrl} alt={result.name} width="55" height="75" />
        <div class="cardHeader">
          <span class="cardName">{result.name}</span>
          <span className="cardCost">{result.manaCost}</span>
        </div>
        <div className="cardFooter">
          <span className="cardExpansion">{result.set}</span>
          <span className="cardType">{result.type}</span>
          {this.getPower(result)}
        </div>
      </li>
	);
  };

  renderImageOnly = result => {
	return (
      <li id={result.id} key={result.id} class="cardResult imageOnly border border-light">
        <img src={result.imageUrl} alt={result.name} width="110" height="150" />
	  </li>
	);
  };

  render() {
	let { result } = this.props;
	let { view } = this.props;
	switch( view ) {
		case VIEW_IMAGEONLY:
		{
			return this.renderImageOnly( result );
		}
		default:
		{
			return this.renderStandard( result );
		}
	}
  };
}

export default SearchResult;
