"use strict";

var cardSet = ['fa-diamond', 'fa-diamond', 'fa-paper-plane-o', 'fa-paper-plane-o', 'fa-anchor', 'fa-anchor', 'fa-bolt', 'fa-bolt',
    'fa-cube', 'fa-cube', 'fa-leaf', 'fa-leaf', 'fa-bicycle', 'fa-bicycle', 'fa-bomb', 'fa-bomb'];

var moveCount = 0, // # of attempts by user
    cardsClicked = [], //list of currently selected cards
    matchCount = 0, // to determine when all matches were made
    openCards = [], //list of open cards
    timeDivisions= { seconds: 0, minutes: 0 }, 
    timeCounter;

var domDeckUl = document.querySelector('.deck'); //get DOM node representing deck UL
var domCards = domDeckUl.getElementsByClassName('card'); // cards li elements
var divCongrats = document.querySelector('div.congrats'); // congrats div
var ulStars = document.querySelector('ul.stars'); // top left stars
var ulCongratsStars = document.querySelector('.congrats .stars'); // congrats box stars
var domTimer = document.querySelector('.timer'); // timer element

document.onLoad = freshDeck(cardSet, domDeckUl, divCongrats); // create fresh deck on doc load

document.querySelector('div.restart').addEventListener('click', function() { freshDeck(cardSet, domDeckUl, divCongrats); }); // add listener to restart button
document.querySelector('.btn-play-again').addEventListener('click', function() { freshDeck(cardSet, domDeckUl, divCongrats); }); // add listener to congrats box play again button

for (var i=0; i < domCards.length; i++ ) { domCards[i].addEventListener('click',
    function(e) { cardClicked(e.target); }); // add listener to each card li element
}

// TODO: Readme

function cardClicked(clickedCard) {

    if (clickedCard.classList.contains('open')
            || clickedCard.classList.contains('show')
            || clickedCard.classList.contains('match')
            || !clickedCard.classList.contains('card') ) { return; } //ensure only closed cards get processed

    if (!cardsClicked.length) { // if no other card currently open
        toggleCardStatus('open', clickedCard); // open card
        cardsClicked.push(clickedCard); // add to open card list
    }
    else {
        cardsClicked.push(clickedCard);
        if (cardsClicked[0].children[0].classList.toString() === cardsClicked[1].children[0].classList.toString()) { // if selected cards match
            for (var i = 0; i < cardsClicked.length; i++) {
                toggleCardStatus('match', cardsClicked[i]); // change card display to matched
            }
            matchCount++; // increase match count
        }
        else { // if no match
            toggleCardStatus('show', cardsClicked[1]); // just show the card symbol for clicked card
            toggleCardStatus('no-match', cardsClicked[0]); // no-match animation for clicked card
            toggleCardStatus('no-match', cardsClicked[1]); // no match animation for open card
            var cardsToClose = [ cardsClicked[0], cardsClicked[1]];
            setTimeout(function() {
                for (var i = 0; i < cardsToClose.length; i++) { toggleCardStatus('close', cardsToClose[i]); }
                }, 700);
        }
        cardsClicked.splice(0);
        if (moveCount === 0) { timeCounter = timer(timeDivisions, domTimer); } // start timer at first move 
        moveCount++;
        updateMovesDisplay(moveCount);
        updateScoreDisplay(ulStars, false, moveCount, 13, 20);
    }

    if (matchCount === 8) {
        endGame(moveCount, divCongrats);
    }

}


function timer(objTimeDivisions, elementClock) {
    
    var fnTimer = setInterval( function() { 
            
        if (objTimeDivisions.seconds < 59) { objTimeDivisions.seconds++; }
        else { objTimeDivisions.seconds = 0; objTimeDivisions.minutes++; }

        updateTimerDisplay(objTimeDivisions.seconds, objTimeDivisions.minutes, elementClock); 

        }, 1000 );
    
    return fnTimer;
    
}

function updateTimerDisplay(intSec, intMin, elementClock) {
    elementClock.innerHTML = intMin + ' min ' + intSec + ' sec'; 
}

function toggleCardStatus (stringStatus, elementCard) {
    switch (stringStatus) {
        case 'open':
            elementCard.classList.add('show', 'open');
            break;
        case 'show':
            elementCard.classList.add('show');
            break;
        case 'match':
            elementCard.classList.add('match');
            break;
        case 'no-match':
            elementCard.classList.add('no-match');
            break;
        case 'close':
            elementCard.classList.remove('show', 'open', 'match', 'no-match');
            break;
    }

}

function freshDeck(arrayCardSet, elementDeckUl, elementCongratsDiv) {

    clearInterval(timeCounter);
    
    var deck = shuffle(arrayCardSet);

    moveCount = 0; 
    matchCount = 0; 
    timeDivisions.minutes = 0; 
    timeDivisions.seconds = 0;

    layoutDeck(deck, elementDeckUl);
    resetCardDisplay(elementDeckUl);
    updateMovesDisplay(moveCount);
    updateScoreDisplay(ulStars, true);
    updateTimerDisplay(0,0, domTimer);

    elementCongratsDiv.style.display = 'none';

}

function updateMovesDisplay(moves) {
    document.querySelector('span.moves').innerHTML = moves.toString();
}

function updateScoreDisplay(elementStars, boolReset, moves, threshold3Star, threshold2Star) {

    if (boolReset) {
         elementStars.children[0].style.color = 'black';
         elementStars.children[1].style.color = 'black';
         elementStars.children[2].style.color = 'black';
    }
    else {
        switch (true) {
            case (moves <= threshold3Star):
                 elementStars.children[0].style.color = 'orange';
                 elementStars.children[1].style.color = 'orange';
                 elementStars.children[2].style.color = 'orange';
                break;
            case (moves <= threshold2Star):
                 elementStars.children[0].style.color = 'orange';
                 elementStars.children[1].style.color = 'orange';
                 elementStars.children[2].style.color = 'black';
                break;
            default :
                 elementStars.children[0].style.color = 'orange';
                 elementStars.children[1].style.color = 'black';
                 elementStars.children[2].style.color = 'black';
        }
    }
}

function resetCardDisplay(elementDeckUl) {

    var ulDeckParent = elementDeckUl.parentNode; //to appendChild new deck later

    var docFrag = document.createDocumentFragment();
    docFrag.appendChild(elementDeckUl);

    for (var i = 0; i < elementDeckUl.children.length; i++) {
                docFrag.firstChild.children[i].classList.remove('open', 'show', 'match');
    }

    ulDeckParent.appendChild(docFrag.firstChild);
}

// Update DOM with new Deck
function layoutDeck(arrayDeck, elementDeckUl) {
    // arrayDeck - array containing the deck of cards

    var ulDeckParent = elementDeckUl.parentNode; //to appendChild new deck later

    var docFrag = document.createDocumentFragment(); //Work on DocumentFragment to avoid reflow
    docFrag.appendChild(elementDeckUl); // fill with current 'deck' unordered list

    for (var i = 0; i < arrayDeck.length; i++) {
        docFrag.firstChild.getElementsByClassName('card')[i].innerHTML='<li class="fa ' + arrayDeck[i] + '"></li>';
    }

    ulDeckParent.appendChild(docFrag.firstChild); //update DOM with new elements in DocumentFragment

}

function endGame(moves, elementCongratsDiv) {

    clearInterval(timeCounter);

    elementCongratsDiv.style.display = 'block';

    var domDivCongratsParent = elementCongratsDiv.parentNode; // to appendChild document later

    var docFrag = document.createDocumentFragment(); // work on doc frag to avoid too many reflows
    docFrag.appendChild(elementCongratsDiv);

    docFrag.firstChild.children[1].innerHTML = "You finished with " + moves + " moves in " 
            + timeDivisions.minutes + " minutes, " + timeDivisions.seconds + " seconds!";

    domDivCongratsParent.appendChild(docFrag.firstChild);

    updateScoreDisplay(ulCongratsStars, false, moves, 13, 20);
    
    

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
