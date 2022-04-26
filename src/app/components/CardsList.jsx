import React, { Component } from "react";
import CardsListItem from "./CardsListItem";

class CardsList extends Component {
  renderCards = (cards, sortType, view, id) => {
    let sortByNameFunction = (a, b) =>
      a.name > b.name ? 1 : a.name < b.name ? -1 : 0;
    let sortByColorFunction = (a, b) =>
      a.manaWeight > b.manaWeight ? 1 : a.manaWeight < b.manaWeight ? -1 : 0;
    switch (sortType) {
      case 1: {
        cards = cards.sort(sortByColorFunction);
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
        {this.renderCards(cards, 1, view, id)}
      </ul>
    );
  }
}

export default CardsList;
