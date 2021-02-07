import React, { useEffect, useState } from 'react';
import NumberDisplay from '../NumberDisplay';
import Button from '../Button';
import { Cell, CellState, Face } from '../../types';
import { generateCells } from '../../utils';
import './App.scss';

const App: React.FC = () => {
    const [cells, setCells] = useState<Cell[][]>(generateCells());
    const [face, setFace] = useState<Face>(Face.smile);
    const [time, setTime] = useState<number>(0);
    const [live, setLive] = useState<boolean>(false);
    const [flagCounter, setFlagCounter] = useState<number>(10);

    useEffect(() => {
        const handleMouseDown = (): void => {
            setFace(Face.oh);
        }
        const handleMouseUp = (): void => {
            setFace(Face.smile);
        }
        const body = document.getElementById('body');
        body?.addEventListener('mousedown', handleMouseDown);
        body?.addEventListener('mouseup', handleMouseUp);

        return () => {
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
    }, [live, time])

    const handleCellClick = (
        rowParam: number,
        colParam: number) => (): void => {
            if (!live) {
                setLive(true);
            }
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
                    row={rowIndex}
                    state={cell.state}
                    value={cell.value}
                />
            )
        );
    };

    const handleFaceClick = (): void => {
        if (live) {
            setLive(false);
            setTime(0);
            setCells(generateCells);
        }
    }

    return (
        <div className="App">
            <div className='Header'>
                <NumberDisplay value={flagCounter} />
                <div className="Face" onClick={handleFaceClick}><span role='img'
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