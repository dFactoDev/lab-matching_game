
function freshDeck(arrayCardSet, elementDeckUl) {
    
    var deck = shuffle(arrayCardSet);
    layoutDeck(arrayCardSet, elementDeckUl);
 
}

// Update DOM with new Deck
function layoutDeck(arrayDeck, elementDeckUl) {
    // arrayDeck - array containing the deck of cards

    ulDeckParent = elementDeckUl.parentNode; //to appendChild new deck later

    var docFrag = document.createDocumentFragment(); //Work on DocumentFragment to avoid reflow
    docFrag.appendChild(elementDeckUl); // fill with current 'deck' unordered list
   
    for (var i = 0; i < arrayDeck.length; i++) {
        docFrag.firstChild.getElementsByClassName('card')[i].innerHTML='<li class="fa ' + arrayDeck[i] + '"></li>';
    }
    
    ulDeckParent.appendChild(docFrag.firstChild); //update DOM with new elements in DocumentFragment
    
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function cardClicked(clickedCard) {
    console.log(clickedCard.target.children[0].classList);
}

var cardSet = ['fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt', 'fa-cube', 'fa-leaf', 'fa-bicycle', 'fa-bomb', 
    'fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt', 'fa-cube', 'fa-leaf', 'fa-bicycle', 'fa-bomb'];

domDeckUl = document.getElementsByClassName('deck')[0]; //get DOM node representing deck UL

document.querySelector('div.restart').addEventListener('click', function() { freshDeck(cardSet, domDeckUl); });
domCards = domDeckUl.getElementsByClassName('card');

for (i=0; i < domCards.length; i++ ) { domCards[i].addEventListener('click', 
    function(e) { cardClicked(e); });
}


//document.


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
