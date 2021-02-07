import { MAX_ROWS, MAX_COLS, MAX_MINES } from '../constants';
import { Cell, CellValue, CellState } from '../types';

export const generateCells = (): Cell[][] => {
    let cells: Cell[][] = [];

    for(let row = 0; row < MAX_ROWS; row++) {
        cells.push([]);
        for(let col = 0; col < MAX_COLS; col++) {
            cells[row].push({
                value: CellValue.none,
                state: CellState.intact
            })
        }
    }

    let minesPlaced = 0;

    while(minesPlaced < MAX_MINES) {
        const randomRow = Math.floor(Math.random() * MAX_ROWS);
        const randomCol = Math.floor(Math.random() * MAX_COLS);

        const currentCell = cells[randomRow][randomCol];
        if(currentCell.value != CellValue.mine){
            // cells = cells.map((row, rowIndex) => row.map((cell, colIndex) => {
            //     if(randomRow == rowIndex && randomCol == colIndex) {
            //         return {
            //             ...cell,
            //             value: CellValue.mine
            //         }
            //     }
            //     return cell;
            // }))
            cells[randomRow][randomCol].value = CellValue.mine;
            minesPlaced++;
        }
    }

    for(let rowIndex = 0; rowIndex < MAX_ROWS; rowIndex++){
        for(let colIndex = 0; colIndex < MAX_COLS; colIndex++){
            let currentCell = cells[rowIndex][colIndex];
            if(currentCell.value != CellValue.mine){
                let numMines = 0;
                const topLeftMine = rowIndex > 0 && colIndex > 0 ? cells[rowIndex - 1][colIndex - 1] : null;
                const topMine = rowIndex > 0 ? cells[rowIndex - 1][colIndex] : null;
                const topRightMine = rowIndex > 0 && colIndex < MAX_COLS - 1 ? cells[rowIndex - 1][colIndex + 1] : null;

                const leftMine = colIndex > 0 ? cells[rowIndex][colIndex - 1] : null;
                const rightMine = colIndex < MAX_COLS - 1 ? cells[rowIndex][colIndex + 1] : null;

                const bottomLeftMine = rowIndex < MAX_ROWS - 1 && colIndex > 0 ? cells[rowIndex + 1][colIndex - 1] : null;
                const bottomMine = rowIndex < MAX_ROWS - 1 ? cells[rowIndex + 1][colIndex] : null;
                const bottomRightMine = rowIndex < MAX_ROWS - 1 && colIndex < MAX_COLS - 1 ? cells[rowIndex + 1][colIndex + 1] : null;
            
                if(topLeftMine?.value == CellValue.mine){
                    numMines++;
                }
                if(topMine?.value == CellValue.mine){
                    numMines++;
                }
                if(topRightMine?.value == CellValue.mine){
                    numMines++;
                }
                if(leftMine?.value == CellValue.mine){
                    numMines++;
                }
                if(rightMine?.value == CellValue.mine){
                    numMines++;
                }
                if(bottomLeftMine?.value == CellValue.mine){
                    numMines++;
                }
                if(bottomMine?.value == CellValue.mine){
                    numMines++;
                }
                if(bottomRightMine?.value == CellValue.mine){
                    numMines++;
                }
                if(numMines > 0){
                    cells[rowIndex][colIndex].value = numMines
                }
            }
        }
    }
    return cells;
}