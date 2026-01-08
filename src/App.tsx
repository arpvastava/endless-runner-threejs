import './App.css'
import { useEffect, useRef } from 'react'
import { Game } from './dom/Game'
import { useGameControls, useGameState } from './state'

function App() {
    const gameRef = useRef<Game | null>(null)
    const gameContainerRef = useRef<HTMLDivElement>(null)

    const gameState = useGameState()
    const { startGame } = useGameControls()

    // Create game instance
    useEffect(() => {
        const game = new Game(gameContainerRef.current!)
        gameRef.current = game
        game.setup()
        game.loop()

        return () => {
            game.destroy()
            gameRef.current = null
        }

    }, [])

    return (
        <>
            <div
                ref={gameContainerRef}
                style={{
                    position: "absolute",
                    top: "0px",
                    left: "0px"
                }}
            />

            <div className="ui">
                {gameState === "startMenu" && (
                    <div className="main-menu">
                        <button className="action-btn" onClick={startGame}>Start</button>
                    </div>
                )}
            </div>
        </>
    )
}

export default App
