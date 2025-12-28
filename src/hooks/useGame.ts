import {useMutation} from "@tanstack/react-query";
import {addGame} from "../services/game.ts";
import type {Game, NewGame} from "../model/types.ts";

export function useAddGame(onSuccess : (newGame: Game) => void ) {
    const {
        mutate,
        data,
        isPending,
        isError,
    } = useMutation(
        {
            mutationFn: (newGame: NewGame) => {
                return addGame(newGame)
            },
            onSuccess: (createdGame) => {
                onSuccess(createdGame)
            },
        })

    return {
        isPending,
        isError,
        game: data,
        addNewGame: mutate,
    }
}
