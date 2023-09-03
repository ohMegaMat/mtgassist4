import React, { Component } from "react";
import CardsList from "./CardsList";

export const SORT_BYNAME = 0;
export const SORT_BYCOLOR = 1;
export const SORT_BYCMC = 2;
export const SORT_BYCMCTHENCOLOR = 3;

class CardsListFilter extends Component {
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

    return (
      <CardsList
        id={id + "_cardsList"}
        cards={cards}
        view={view}
        onCardClick={this.props.onCardClick}
      />
    );
  };

  render() {
    let { cards } = this.props;
    let { view } = this.props;
    let { id } = this.props;

    return (
      <div>
        { this.renderCards(cards, SORT_BYCOLOR, view, id) }
      </div>
    );
  }
}

export default CardsListFilter;
