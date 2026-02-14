import { StateManager } from "../state"
import type { GameState } from "../state/StateManager"

export class UI {
    private stateManager: StateManager

    private loadingUI: HTMLDivElement

    constructor() {
        // Setup managers
        this.stateManager = StateManager.getInstance()

        // Set references
        this.loadingUI = document.querySelector(".loading") as HTMLDivElement
    }

    setup() {
        // Listen for events
        this.stateManager.on("stateChange", this.onStateChange)
    }

    private onStateChange = (data: GameState) => {
        if (data !== "loading") {
            this.loadingUI.classList.add("disabled")
        }
    }

    destroy() {
        // Remove event listeners
        this.stateManager.off("stateChange", this.onStateChange)
    }
}