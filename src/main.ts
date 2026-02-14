import { Game } from "./classes/Game"

main()

async function main() {
    const container = document.getElementById("root") as HTMLDivElement
    if (!container) {
        console.warn("Cannot find container with id: root")
        return
    }

    const game = new Game(container)
    await game.setup()
    game.loop()
}