var dealerSum = 0;
var yourSum = 0;

var dealerAceCount = 0;
var yourAceCount = 0;

var hidden;
var deck;

var canHit = true;

window.onload = function(){
    buildDeck();
    shuffleDeck();
    startGame();
}

function buildDeck(){
    let value = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    let suit = ['C', 'D', 'H', "s"];
    deck = [];

    for(let i = 0; i < suit.length; ++i){
        for(let j = 0; j < value.length; ++j){
            deck.push(value[j] + '-' + suit[i]);
        }
    }
}

function shuffleDeck(){
    for(let i = deck.length-1; i > 0; i--){
        let j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    console.log(deck);
}

function startGame(){
    // give "you" first card
    giveYouCard();
    // give "dealer" a hidden card
    hidden = deck.pop();
    dealerSum += getValue(hidden);
    dealerAceCount += checkAce(hidden);
    // give "you" second card
    giveYouCard();
    // give "dealer" second card
    giveDealerCard();

    document.getElementById("your-sum").textContent = yourSum;

    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stay").addEventListener("click", stay);
    document.getElementById("new-game").addEventListener("click", function(){window.location.reload();});
}

function getValue(card){
    let data = card.split('-'); // "4-C" -> ["4", "C"]
    let value = data[0]; // "4"

    if(isNaN(value)){
        if(value == "A"){
            return 11;
        }
        return 10;
    }
    return parseInt(value);
}

function checkAce(card){
    if(card[0] == "A"){
        return 1;
    }
    return 0;
}

function giveYouCard(){
    let cardImg = document.createElement("img"); // create <img>
    let card = deck.pop();
    cardImg.src = "./cards/" + card + ".png"; // set its src
    yourSum += getValue(card);
    yourAceCount += checkAce(card);
    document.getElementById("your-cards").append(cardImg); // append <img src="..."> into <div id="dealer-cards">
}

function giveDealerCard(){
    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./cards/" + card + ".png";
    dealerSum += getValue(card);
    dealerAceCount += checkAce(card);
    document.getElementById("dealer-cards").append(cardImg);
}

function hit(){
    if(!canHit){
        return;
    }
    giveYouCard();

    if(reduceAce(yourSum, yourAceCount) > 21){
        canHit = false;
    }
    
    document.getElementById("your-sum").textContent = yourSum;
}

function reduceAce(yourSum, yourAceCount){
    while(yourSum > 21 && yourAceCount > 0){
        yourSum -= 10;
        yourAceCount -= 1;
    }
    return yourSum;
}

function stay(){
    while(dealerSum < 17){
        giveDealerCard();
    }

    dealerSum = reduceAce(dealerSum, dealerAceCount);
    yourSum = reduceAce(yourSum, yourAceCount);

    canHit = false;
    document.getElementById("hidden").src = "./cards/" + hidden + ".png";

    let messege = "";
    if (yourSum > 21){
        messege = "You Lose!";
    }else if (dealerSum > 21){
        messege = "You Win !";
    }else if (yourSum == dealerSum){
        messege = "It's a tie !";
    }else if (yourSum > dealerSum){
        messege = "You Win !";
    }else if (yourSum < dealerSum){
        messege = "You Lose !";
    }

    document.getElementById("dealer-sum").textContent = dealerSum;
    document.getElementById("your-sum").textContent = yourSum;
    document.getElementById("results").textContent = messege;
}