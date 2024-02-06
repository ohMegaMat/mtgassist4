import React, { Component } from "react";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
//import 'bootstrap/dist/css/bootstrap.css'

class CardsListDropdown extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false
    };
  }

  toggle() {
    console.log("toggle click > "+ this.state.dropdownOpen);
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }

  renderCards = (cards) => {
    let cardList = cards.map((card, i) => (
      <DropdownItem
        key={this.props.id + "_card_" + i}
        onClick={e => this.props.onCardClick(card, this.props.id + "_card_" + i, e)}
      >
        { card.name }
      </DropdownItem>
    ));
    return cardList;
  };

  render() {
    let { cards } = this.props;
    let { id } = this.props;

    return (
      <Dropdown id={id + "_cardsList"} isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle caret>
          Library
        </DropdownToggle>
        <DropdownMenu>
          { this.renderCards(cards) }
        </DropdownMenu>
      </Dropdown>
    );
  }
}

export default CardsListDropdown;
