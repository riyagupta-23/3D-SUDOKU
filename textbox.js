document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('sudoku-container');
    const gridSize = 9; // for a 9x9 Sudoku grid
    const squareSize = container.offsetWidth / gridSize;

    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const input = document.createElement('input');
            input.type = 'text';
            input.maxLength = 1; // Only allow one character in each input
            input.style.left = `${j * squareSize}px`;
            input.style.top = `${i * squareSize}px`;
            container.appendChild(input);
        }
    }
});
