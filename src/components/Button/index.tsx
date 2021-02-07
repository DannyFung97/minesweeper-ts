import React from 'react';
import { CellState, CellValue } from '../../types';
import './Button.scss';

interface ButtonProps {
    row: number;
    col: number;
    state: CellState;
    value: CellValue;
    onClick(rowParam: number, colParam: number): (...args: any[]) => void;
    onContextMenu(rowParam: number, colParam: number): (...args: any[]) => void;
}

const Button: React.FC<ButtonProps> = ({row, col, onClick, onContextMenu, state, value}) => {
    const renderContent = (): React.ReactNode => {
        if(state == CellState.dug) {
            if(value == CellValue.mine) {
                return <span role='img' aria-label='mine'>💣</span>
            }
            return value == CellValue.none ? null: value;
        } 
        else if (state == CellState.flagged) {
            return <span role='img' aria-label='flag'>🚩</span>
        }
        return null;
    }

    return <div className={`Button ${state == CellState.dug ? 'dug' : ''
    } value-${value}`} 
    onClick={onClick(row, col)}
    onContextMenu={onContextMenu(row, col)}
    >
        {renderContent()}
    </div>;
}

export default Button;