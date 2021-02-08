import { MAX_ROWS, MAX_COLS, MAX_MINES } from '../constants';
import { Cell, CellValue, CellState } from '../types';

const grabAllAdjacentCells = (
    cells: Cell[][],
    rowParam: number,
    colParam: number): {
        topLeftCell: Cell | null;
        topCell: Cell | null;
        topRightCell: Cell | null;
        leftCell: Cell | null;
        rightCell: Cell | null;
        bottomLeftCell: Cell | null;
        bottomCell: Cell | null;
        bottomRightCell: Cell | null;
    } => {
    const topLeftCell = rowParam > 0 && colParam > 0 ? cells[rowParam - 1][colParam - 1] : null;
    const topCell = rowParam > 0 ? cells[rowParam - 1][colParam] : null;
    const topRightCell = rowParam > 0 && rowParam < MAX_COLS - 1 ? cells[rowParam - 1][colParam + 1] : null;
    const leftCell = colParam > 0 ? cells[rowParam][colParam - 1] : null;
    const rightCell = colParam < MAX_COLS - 1 ? cells[rowParam][colParam + 1] : null;
    const bottomLeftCell = rowParam < MAX_ROWS - 1 && colParam > 0 ? cells[rowParam + 1][colParam - 1] : null;
    const bottomCell = rowParam < MAX_ROWS - 1 ? cells[rowParam + 1][colParam] : null;
    const bottomRightCell = rowParam < MAX_ROWS - 1 && colParam < MAX_COLS - 1 ? cells[rowParam + 1][colParam + 1] : null;

    return {
        topLeftCell,
        topCell,
        topRightCell,
        leftCell,
        rightCell,
        bottomLeftCell,
        bottomCell,
        bottomRightCell
    }
}

export const generateCells = (): Cell[][] => {
    let cells: Cell[][] = [];

    for (let row = 0; row < MAX_ROWS; row++) {
        cells.push([]);
        for (let col = 0; col < MAX_COLS; col++) {
            cells[row].push({
                value: CellValue.none,
                state: CellState.intact
            })
        }
    }

    let minesPlaced = 0;

    while (minesPlaced < MAX_MINES) {
        const randomRow = Math.floor(Math.random() * MAX_ROWS);
        const randomCol = Math.floor(Math.random() * MAX_COLS);

        const currentCell = cells[randomRow][randomCol];
        if (currentCell.value != CellValue.mine) {
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

    for (let rowIndex = 0; rowIndex < MAX_ROWS; rowIndex++) {
        for (let colIndex = 0; colIndex < MAX_COLS; colIndex++) {
            let currentCell = cells[rowIndex][colIndex];
            if (currentCell.value != CellValue.mine) {
                let numMines = 0;

                const {
                    topLeftCell,
                    topCell,
                    topRightCell,
                    leftCell,
                    rightCell,
                    bottomLeftCell,
                    bottomCell,
                    bottomRightCell
                } = grabAllAdjacentCells(cells, rowIndex, colIndex);

                if (topLeftCell?.value == CellValue.mine) {
                    numMines++;
                }
                if (topCell?.value == CellValue.mine) {
                    numMines++;
                }
                if (topRightCell?.value == CellValue.mine) {
                    numMines++;
                }
                if (leftCell?.value == CellValue.mine) {
                    numMines++;
                }
                if (rightCell?.value == CellValue.mine) {
                    numMines++;
                }
                if (bottomLeftCell?.value == CellValue.mine) {
                    numMines++;
                }
                if (bottomCell?.value == CellValue.mine) {
                    numMines++;
                }
                if (bottomRightCell?.value == CellValue.mine) {
                    numMines++;
                }
                if (numMines > 0) {
                    cells[rowIndex][colIndex].value = numMines
                }
            }
        }
    }
    return cells;
}

export const openMultipleCells = (
    cells: Cell[][],
    rowParam: number,
    colParam: number
): Cell[][] => {
    let newCells = cells.slice();
    newCells[rowParam][colParam].state = CellState.dug;
    const {
        topLeftCell,
        topCell,
        topRightCell,
        leftCell,
        rightCell,
        bottomLeftCell,
        bottomCell,
        bottomRightCell
    } = grabAllAdjacentCells(cells, rowParam, colParam);

    if (topLeftCell?.state == CellState.intact &&
        topLeftCell.value != CellValue.mine
    ) {
        if(topLeftCell.value == CellValue.none){
            newCells = openMultipleCells(newCells, rowParam - 1, colParam - 1);
        } else {
            newCells[rowParam - 1][colParam - 1].state = CellState.dug;
        }
    }

    if (topCell?.state == CellState.intact &&
        topCell.value != CellValue.mine
    ) {
        if(topCell.value == CellValue.none){
            newCells = openMultipleCells(newCells, rowParam - 1, colParam); 
        } else {
            newCells[rowParam - 1][colParam].state = CellState.dug;
        }
    }

    if (topRightCell?.state == CellState.intact &&
        topRightCell.value != CellValue.mine
    ) {
        if(topRightCell.value == CellValue.none){
            newCells = openMultipleCells(newCells, rowParam - 1, colParam + 1); 
        } else {
            newCells[rowParam - 1][colParam + 1].state = CellState.dug;
        }
    }

    if (leftCell?.state == CellState.intact &&
        leftCell.value != CellValue.mine
    ) {
        if(leftCell.value == CellValue.none){
            newCells = openMultipleCells(newCells, rowParam, colParam - 1); 
        } else {
            newCells[rowParam][colParam - 1].state = CellState.dug;
        }
    }

    if (rightCell?.state == CellState.intact &&
        rightCell.value != CellValue.mine
    ) {
        if(rightCell.value == CellValue.none){
            newCells = openMultipleCells(newCells, rowParam, colParam + 1); 
        } else {
            newCells[rowParam][colParam + 1].state = CellState.dug;
        }
    }

    if (bottomLeftCell?.state == CellState.intact &&
        bottomLeftCell.value != CellValue.mine
    ) {
        if(bottomLeftCell.value == CellValue.none){
            newCells = openMultipleCells(newCells, rowParam + 1, colParam - 1); 
        } else {
            newCells[rowParam + 1][colParam - 1].state = CellState.dug;
        }
    }

    if (bottomCell?.state == CellState.intact &&
        bottomCell.value != CellValue.mine
    ) {
        if(bottomCell.value == CellValue.none){
            newCells = openMultipleCells(newCells, rowParam + 1, colParam); 
        } else {
            newCells[rowParam + 1][colParam].state = CellState.dug;
        }
    }

    if (bottomRightCell?.state == CellState.intact &&
        bottomRightCell.value != CellValue.mine
    ) {
        if(bottomRightCell.value == CellValue.none){
            newCells = openMultipleCells(newCells, rowParam + 1, colParam + 1); 
        } else {
            newCells[rowParam + 1][colParam + 1].state = CellState.dug;
        }
    }

    return newCells;
};