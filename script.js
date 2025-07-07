const subGames = document.querySelectorAll(".sub-game");
const subCells = document.querySelectorAll(".sub-cell");
const Cells = document.querySelectorAll(".cell");
const $gameBoard = document.querySelector(".game-board");
const $winmsg = document.querySelector(".win-msg")

let playerTurn = "x";
let nextBoard = null;
let tempoParaRefresh = 2000;

function checkVictory(subGame) {

    const subCell = subGame.querySelectorAll('.sub-cell');
    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], 
        [0, 3, 6], [1, 4, 7], [2, 5, 8], 
        [0, 4, 8], [2, 4, 6]             
    ];

    winConditions.forEach((condition) => {
        const [a, b, c] = condition;

        if (
            subCell[a].getAttribute('data-state') &&
            subCell[a].getAttribute('data-state') == subCell[b].getAttribute('data-state') &&
            subCell[a].getAttribute('data-state') == subCell[c].getAttribute('data-state') &&
            subCell[a].getAttribute('data-state') != "empty" && subGame.getAttribute('sub-game-state') != "closed"
        ) {

            const winner = subCell[a].getAttribute('data-state');
            let parent = subGame.parentElement;
            parent.setAttribute('data-winner', winner);
            subGame.setAttribute('sub-game-state', "closed")

        }




    });
}

function checkChampion() {
    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], 
        [0, 3, 6], [1, 4, 7], [2, 5, 8], 
        [0, 4, 8], [2, 4, 6]            
    ];
    winConditions.forEach((condition) => {
        const [a, b, c] = condition;

        if (Cells[a].getAttribute('data-winner') &&
            Cells[a].getAttribute('data-winner') == Cells[b].getAttribute('data-winner') &&
            Cells[a].getAttribute('data-winner') == Cells[c].getAttribute('data-winner') &&
            Cells[a].getAttribute('data-winner') != "empty" && $gameBoard.getAttribute('data-big-win') == "empty") {

            const bigwinner = Cells[a].getAttribute('data-winner');
            console.log("passei")
            console.log(bigwinner)
            $gameBoard.setAttribute('data-big-win', bigwinner);
            if ($gameBoard.getAttribute('data-big-win') == bigwinner) {

                $winmsg.setAttribute('champion', bigwinner)

                setTimeout(function () {
                    window.location.reload();
                }, tempoParaRefresh);
            }

        }

    })
}

function play(subGame) {
    const cellsInThisGame = subGame.querySelectorAll('.sub-cell');
    cellsInThisGame.forEach((subCell) => {
        subCell.addEventListener('click', () => {
            if (subCell.classList.contains('clicked')) {
                if (!subCell.classList.contains('x') && !subCell.classList.contains('o')) {
                    const currentState = subCell.getAttribute('data-state');
                    nextBoard = subCell.getAttribute('subdata-cell')
                    if (currentState == "empty" && playerTurn == "x") {
                        subCell.setAttribute('data-state', 'x');
                        subCell.classList.add('x');
                        playerTurn = "o"
                    } else if (currentState == "empty" && playerTurn == "o") {
                        subCell.setAttribute('data-state', 'o');
                        subCell.classList.add('o');
                        playerTurn = "x"
                    }


                    checkVictory(subGame)
                    checkChampion()
                    if (nextBoard != null) {
                        let nextSubGame = null;
                        subGames.forEach((subGame) => {
                            if (subGame.getAttribute('subdata-game') == nextBoard) {
                                nextSubGame = subGame
                            }
                        });

                        expandGame(nextSubGame)
                        play(nextSubGame)
                    }
                }
            }
        });
    });
}

function expandGame(subGame) {
    subGames.forEach((game) => game.classList.remove('clicked'));
    subGame.classList.add('clicked');

    subCells.forEach((subCell) => subCell.classList.remove('clicked'));
    const cellsInClickedGame = subGame.querySelectorAll('.sub-cell');
    cellsInClickedGame.forEach((subCell) => subCell.classList.add('clicked'));

}

subGames.forEach((subGame) => {
    subGame.addEventListener('click', () => {
        if (nextBoard == null) {
            expandGame(subGame)
            play(subGame)
        }

    });
})







