const board = document.querySelector('#board');
let turn = 0;
board.addEventListener('touchend',(e) => {
    if (turn%2 === 0){
        e.target.innerHTML = "<p>X</p>"
        
    }
    else{
        e.target.innerHTML = "<p>O</p>"
    };
    turn++;
 console.log(e);
})