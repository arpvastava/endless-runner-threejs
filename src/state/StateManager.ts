type GameState = "startMenu" | "playing" | "paused" | "resultMenu"

type GameEvents = {
    stateChange: GameState
}

type EventListener<T> = (data: T) => void

export class StateManager {
    private static instance: StateManager | null = null
    private state: GameState = "startMenu"
    private listeners: Map<keyof GameEvents, Set<EventListener<any>>> = new Map()

    constructor() {

    }

    // -------------------------------------------------Event System-------------------------------------------------
    on<K extends keyof GameEvents>(event: K, listener: EventListener<GameEvents[K]>): void {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set())
        }

        this.listeners.get(event)!.add(listener)
    }

    off<K extends keyof GameEvents>(event: K, listener: EventListener<GameEvents[K]>): void {
        const eventListeners = this.listeners.get(event)
        if (eventListeners) {
            eventListeners.delete(listener)
        }
    }

    emit<K extends keyof GameEvents>(event: K, data: GameEvents[K]): void {
        const eventListeners = this.listeners.get(event)
        if (eventListeners) {
            eventListeners.forEach(listener => listener(data))
        }
    }

    reset(): void {

    }

    destroy(): void {
        this.listeners.clear()
    }

    // -------------------------------------------------Methods-------------------------------------------------
    static getInstance(): StateManager {
        if (!StateManager.instance) {
            StateManager.instance = new StateManager()
        }

        return StateManager.instance
    }

    getState(): GameState {
        return this.state
    }

    setState(newState: GameState): void {
        this.state = newState
        this.emit("stateChange", this.state)
    }
}