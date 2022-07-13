const SUITS = ["♠", "♣", "♥", "♦"];
const VALUES = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

export default class Deck{
    constructor(cards = freshDeck()){
        this.cards = cards;
    }
    
    shuffle(){
        for(let i = this.cards.length - 1; i > 0; i--){
        const newIndex = Math.floor(Math.random() * (i + 1));
        const temp = this.cards[newIndex];
        this.cards[newIndex] = this.cards[i];
        this.cards[i] = temp;
        }
    }

    pop(){
        return this.cards.shift();
    }

    push(card){
        this.cards.push(card);
    }
}

class Card{
    constructor(suit, value){
        this.suit = suit;
        this.value = value;
    }

    get color(){
        if(this.suit === "♥" || this.suit === "♦"){
            return "red";
        }
        return "black";
    }

    getHTML(){
        const cardDiv = document.createElement("div");
        cardDiv.innerText = this.suit;
        cardDiv.classList.add("card", this.color);
        cardDiv.dataset.value = `${this.value} ${this.suit}`;
        return cardDiv;

    }
}

function freshDeck(){
    return SUITS.flatMap(suit => {
        return VALUES.map(value => { 
            return new Card(suit, value)
        })
    });
}