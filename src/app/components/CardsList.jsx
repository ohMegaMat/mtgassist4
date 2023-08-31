import React, { Component } from "react";
import CardsListItem from "./CardsListItem";

export const SORT_BYNAME = 0;
export const SORT_BYCOLOR = 1;
export const SORT_BYCMC = 2;
export const SORT_BYCMCTHENCOLOR = 3;

class CardsList extends Component {
  renderCards = (cards, sortType, view, id) => {
    let sortByNameFunction = (a, b) =>
      (a.name > b.name) ? 1 : (a.name < b.name ? -1 : 0);
    let sortByColorFunction = (a, b) =>
      (a.manaWeight > b.manaWeight) ? 1 : (a.manaWeight < b.manaWeight ? -1 : 0);
    let sortByCMCFunction = (a, b) =>
      isNaN(a.manaCost) ? 1 : (a.manaCost > b.manaCost) ? 1 : (a.manaCost < b.manaCost ? -1 : 0);
    let sortByCMCThenColorFunction = (a, b) =>
      (a.manaCost > b.manaCost) ? 1 : (a.manaCost < b.manaCost ? -1 : ((a.manaWeight > b.manaWeight) ? 1 : (a.manaWeight < b.manaWeight ? -1 : 0)));
    switch (sortType) {
      case SORT_BYCOLOR: {
        cards = cards.sort(sortByColorFunction);
        break;
      }
      case SORT_BYCMC: {
        cards = cards.sort(sortByCMCFunction);
        break;
      }
      case SORT_BYCMCTHENCOLOR: {
        cards = cards.sort(sortByCMCThenColorFunction);
        break;
      }
      default: {
        cards = cards.sort(sortByNameFunction);
        break;
      }
    }
    let cardList = cards.map((card, i) => (
      <CardsListItem
        card={card}
        view={view}
        id={id + "_card_" + i}
        key={id + "_card_" + i}
        onCardClick={this.props.onCardClick}
      />
    ));
    return cardList;
  };

  render() {
    let { cards } = this.props;
    let { view } = this.props;
    let { id } = this.props;

    return (
      <ul id={id + "_cardsList"} className="cardsList">
        {this.renderCards(cards, SORT_BYCOLOR, view, id)}
      </ul>
    );
  }
}

export default CardsList;
