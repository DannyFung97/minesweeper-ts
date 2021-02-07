export enum CellValue {
    none,
    one,
    two,
    three,
    four,
    five,
    six,
    seven,
    eight,
    mine
}

export enum CellState {
    intact,
    dug,
    flagged
}

export type Cell = {value: CellValue, state: CellState};