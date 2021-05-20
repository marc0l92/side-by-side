import React from 'react'
import { v4 as uuid } from 'uuid';

export enum NOTES_ACTIONS {
    CREATE,
    EDIT,
}

export const reducer: React.Reducer<INotesState, INoteAction> = (prevState, action) => {
    switch (action.type) {
        case NOTES_ACTIONS.CREATE:
            const newNote: INote = {
                id: uuid(),
                text: action.payload.text,
                reference: action.payload.reference || false,
                position: {
                    x: action.payload.position.x,
                    y: action.payload.position.y,
                },
                size: {
                    x: -1,
                    y: 0,
                }
            }
            return { ...prevState, notes: [...prevState.notes, newNote] }
        case NOTES_ACTIONS.EDIT:
            return {
                ...prevState,
                notes: prevState.notes.map((note) => {
                    if (note.id === action.payload.id) {
                        note = Object.assign(note, action.payload)
                    }
                    return note
                })
            }
        default:
            return prevState
    }
}

export interface INotesState {
    notes: INote[],
}
export interface INote {
    id?: string,
    reference?: boolean,
    text?: string,
    position?: IPosition,
    size?: IPosition,
}
export interface INoteAction {
    type: NOTES_ACTIONS,
    payload: INote,
}
export interface IPosition {
    x: number, y: number
}