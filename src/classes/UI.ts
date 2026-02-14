import { AudioManager } from "../asset-managers/AudioManager"
import { StateManager } from "../state"
import type { GameState } from "../state/StateManager"

export class UI {
    private stateManager: StateManager
    private audioManager: AudioManager

    private isNewHighscore: boolean = false

    private ui: HTMLDivElement
    private loadingUI: HTMLDivElement

    private startMenu: HTMLDivElement
    private startBtn: HTMLButtonElement
    private highscore: HTMLParagraphElement

    private playingMenu: HTMLDivElement
    private score: HTMLParagraphElement
    private pauseBtn: HTMLButtonElement

    private pausedMenu: HTMLDivElement
    private resumeBtn: HTMLButtonElement

    private resultMenu: HTMLDivElement
    private restartBtn: HTMLButtonElement
    private scoreResult: HTMLParagraphElement
    private highscoreMessage: HTMLParagraphElement

    constructor() {
        // Setup managers
        this.stateManager = StateManager.getInstance()
        this.audioManager = AudioManager.getInstance()

        // Set references
        this.ui = document.querySelector("#ui") as HTMLDivElement
        this.loadingUI = document.querySelector(".loading") as HTMLDivElement

        this.startMenu = this.ui.querySelector(".start-menu") as HTMLDivElement
        this.startBtn = this.startMenu.querySelector(".action-btn") as HTMLButtonElement
        this.highscore = this.startMenu.querySelector(".highscore") as HTMLParagraphElement

        this.playingMenu = this.ui.querySelector(".playing-menu") as HTMLDivElement
        this.score = this.playingMenu.querySelector(".score") as HTMLParagraphElement
        this.pauseBtn = this.playingMenu.querySelector(".pause-btn") as HTMLButtonElement

        this.pausedMenu = this.ui.querySelector(".paused-menu") as HTMLDivElement
        this.resumeBtn = this.pausedMenu.querySelector("button") as HTMLButtonElement

        this.resultMenu = this.ui.querySelector(".result-menu") as HTMLDivElement
        this.restartBtn = this.resultMenu.querySelector("button") as HTMLButtonElement
        this.scoreResult = this.resultMenu.querySelector(".score-result") as HTMLParagraphElement
        this.highscoreMessage = this.resultMenu.querySelector(".highscore-message") as HTMLParagraphElement
    }

    setup() {
        // Update menus visibility
        this.updateMenusVisibility()

        // Listen for events
        this.stateManager.on("stateChange", this.onStateChange)
        this.stateManager.on("highscoreChange", this.onHighscoreChange)
        window.addEventListener("resize", this.onWindowResize)
        this.startBtn.addEventListener("click", this.onStartOrRestart)
        this.pauseBtn.addEventListener("click", this.onPauseBtnPressed)
        this.resumeBtn.addEventListener("click", this.onResumeBtnPressed)
        this.restartBtn.addEventListener("click", this.onStartOrRestart)
    }

    update() {
        const highscore = Math.floor(this.stateManager.getHighscore())
        this.highscore.textContent = `🏆 ${highscore}`

        const score = Math.floor(this.stateManager.getScore())
        this.score.textContent = score.toString()
    }

    private onWindowResize = () => {
        this.ui.style.width = `${window.innerWidth}px`
        this.ui.style.height = `${window.innerHeight}px`
    }

    private onStateChange = () => {
        this.updateMenusVisibility()
    }

    private updateMenusVisibility() {
        const state: GameState = this.stateManager.getState()

        if (state === "loading") this.loadingUI.classList.remove("disabled")
        else this.loadingUI.classList.add("disabled")

        if (state === "startMenu") this.startMenu.classList.remove("disabled")
        else this.startMenu.classList.add("disabled")

        if (state === "playing") {
            this.playingMenu.classList.remove("disabled")
            this.isNewHighscore = false
        }
        else {
            this.playingMenu.classList.add("disabled")
        }

        if (state === "paused") this.pausedMenu.classList.remove("disabled")
        else this.pausedMenu.classList.add("disabled")

        if (state === "resultMenu") {
            this.resultMenu.classList.remove("disabled")

            // Show highscore
            const score = Math.floor(this.stateManager.getScore())

            if (this.isNewHighscore) {
                this.scoreResult.textContent = `🏆 ${score}`
                this.highscoreMessage.classList.remove("disabled")
            }
            else {
                this.scoreResult.textContent = `⭐ ${score}`
                this.highscoreMessage.classList.add("disabled")
            }
        }
        else {
            this.resultMenu.classList.add("disabled")
        }
    }

    private onStartOrRestart = () => {
        this.stateManager.reset()
        this.stateManager.setState("playing")
        this.stateManager.setScore(0)
        this.stateManager.startBGM()

        this.audioManager.playOneShot("click")
    }

    private onPauseBtnPressed = () => {
        this.stateManager.setState("paused")
    }

    private onResumeBtnPressed = () => {
        this.stateManager.setState("playing")
    }

    private onHighscoreChange = () => {
        this.isNewHighscore = true
    }

    destroy() {
        // Remove event listeners
        this.stateManager.off("stateChange", this.onStateChange)
        this.stateManager.off("highscoreChange", this.onHighscoreChange)
        window.removeEventListener("resize", this.onWindowResize)
        this.startBtn.removeEventListener("click", this.onStartOrRestart)
        this.pauseBtn.removeEventListener("click", this.onPauseBtnPressed)
        this.resumeBtn.removeEventListener("click", this.onResumeBtnPressed)
        this.restartBtn.removeEventListener("click", this.onStartOrRestart)
    }
}