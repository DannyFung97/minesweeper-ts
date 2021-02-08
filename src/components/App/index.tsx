import React, { useEffect, useState } from 'react';
import NumberDisplay from '../NumberDisplay';
import Button from '../Button';
import { Cell, CellState, CellValue, Face } from '../../types';
import { generateCells, openMultipleCells } from '../../utils';
import './App.scss';
import { MAX_COLS, MAX_ROWS, MAX_FLAGS } from '../../constants';

const App: React.FC = () => {
    const [cells, setCells] = useState<Cell[][]>(generateCells());
    const [face, setFace] = useState<Face>(Face.smile);
    const [time, setTime] = useState<number>(0);
    const [live, setLive] = useState<boolean>(false);
    const [flagCounter, setFlagCounter] = useState<number>(MAX_FLAGS);
    const [hasLost, setHasLost] = useState<boolean>(false);
    const [hasWon, setHasWon] = useState<boolean>(false);

    useEffect(() => {
        const handleMouseDown = (): void => {
            setFace(Face.oh);
        }
        const handleMouseUp = (): void => {
            setFace(Face.smile);
        }
        const face = document.getElementById('face');
        const body = document.getElementById('body');
        face?.addEventListener('mousedown', handleMouseDown);
        face?.addEventListener('mouseup', handleMouseUp);
        body?.addEventListener('mousedown', handleMouseDown);
        body?.addEventListener('mouseup', handleMouseUp);

        return () => {
            face?.removeEventListener('mousedown', handleMouseDown);
            face?.removeEventListener('mouseup', handleMouseUp);
            body?.removeEventListener('mousedown', handleMouseDown);
            body?.removeEventListener('mouseup', handleMouseUp);
        }
    }, []);

    useEffect(() => {
        if (live && time < 999) {
            const timer = setInterval(() => {
                setTime(time + 1);
            }, 1000);

            return () => {
                clearInterval(timer);
            }
        }
    }, [live, time]);

    useEffect(() => {
        if (hasLost) {
            setLive(false);
            setFace(Face.lost);
        }
    }, [hasLost]);

    useEffect(() => {
        if (hasWon) {
            setLive(false);
            setFace(Face.won);
        }
    }, [hasWon]);

    const handleCellClick = (
        rowParam: number,
        colParam: number) => (): void => {

            let newCells = cells.slice();

            if (!live) {
                let isAMine = newCells[rowParam][colParam].value == CellValue.mine;
                while (isAMine) {
                    newCells = generateCells();
                    isAMine = newCells[rowParam][colParam].value == CellValue.mine;
                }
                setLive(true);
            }

            const currentCell = newCells[rowParam][colParam];

            if (currentCell.state == CellState.flagged ||
                currentCell.state == CellState.dug) {
                return;
            }

            if (currentCell.value == CellValue.mine) {
                setHasLost(true);
                newCells[rowParam][colParam].red = true;
                newCells = showAllBombs();
                setCells(newCells);
                return;
            } else if (currentCell.value == CellValue.none) {
                newCells = openMultipleCells(newCells, rowParam, colParam);
            } else {
                newCells[rowParam][colParam].state = CellState.dug;
            }

            let safeIntactCellsExist = false;
            for (let row = 0; row < MAX_ROWS; row++) {
                for (let col = 0; col < MAX_COLS; col++) {
                    if (newCells[row][col].state == CellState.intact &&
                        newCells[row][col].value != CellValue.mine) {
                        safeIntactCellsExist = true;
                        break;
                    }
                }
            }

            if (!safeIntactCellsExist) {
                newCells = newCells.map(row => row.map(cell => {
                    if (cell.value == CellValue.mine) {
                        return {
                            ...cell,
                            state: CellState.flagged
                        }
                    }
                    return cell;
                }))
                setHasWon(true);
            }
            setCells(newCells);
        }

    const handleCellContext = (
        rowParam: number,
        colParam: number) => (
            e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
            e.preventDefault();

            if (live) {
                const currentCell = cells[rowParam][colParam]
                const currentCells = cells.slice();
                if (currentCell.state == CellState.dug) {
                    return;
                } else if (currentCell.state == CellState.intact) {
                    currentCells[rowParam][colParam].state = CellState.flagged;
                    setCells(currentCells);
                    setFlagCounter(flagCounter - 1);
                }
                else if (currentCell.state == CellState.flagged) {
                    currentCells[rowParam][colParam].state = CellState.intact;
                    setCells(currentCells);
                    setFlagCounter(flagCounter + 1);
                }
            }
        }

    const renderCells = (): React.ReactNode => {
        return cells.map((row, rowIndex) =>
            row.map((cell, colIndex) =>
                <Button
                    col={colIndex}
                    key={`${rowIndex}-${colIndex}`}
                    onClick={handleCellClick}
                    onContextMenu={handleCellContext}
                    red={cell.red}
                    row={rowIndex}
                    state={cell.state}
                    value={cell.value}
                />
            )
        );
    };

    const handleFaceClick = (): void => {
        setLive(false);
        setTime(0);
        setCells(generateCells);
        setHasLost(false);
        setHasWon(false);
        setFlagCounter(MAX_FLAGS);
    }

    const showAllBombs = (): Cell[][] => {
        const currentcells = cells.slice();
        return currentcells.map(row => row.map(cell => {
            if (cell.value == CellValue.mine) {
                return {
                    ...cell,
                    state: CellState.dug
                }
            }
            return cell;
        }))
    }

    return (
        <div className="App">
            <div className='Header'>
                <NumberDisplay value={flagCounter} />
                <div id='face' className="Face" onClick={handleFaceClick}><span role='img'
                    aria-label='face'>{face}</span></div>
                <NumberDisplay value={time} />
            </div>
            <div id='body' className='Body'>
                {renderCells()}
            </div>
        </div>
    )
}

export default App;