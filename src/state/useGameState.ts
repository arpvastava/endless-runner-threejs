import { useSyncExternalStore } from "react";
import { StateManager } from "./StateManager";


export function useGameState() {
    const manager = StateManager.getInstance()

    const subscribe = (callback: () => void) => {
        manager.on("stateChange", callback)
        return () => manager.off("stateChange", callback)
    }

    const getSnapshot = () => manager.getState()

    return useSyncExternalStore(subscribe, getSnapshot)
}

export function useGameControls() {
    const manager = StateManager.getInstance()

    return {
        startGame: () => {
            manager.reset()
            manager.setState("playing")
        },
        pauseGame: () => manager.setState("paused"),
        resumeGame: () => manager.setState("playing"),
        endGame: () => manager.setState("resultMenu"),
        returnToStartMenu: () => manager.setState("startMenu")
    }
}