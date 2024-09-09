import { ItemIdentifier } from "@serenityjs/item";
import { Serenity } from "@serenityjs/serenity";
import { Player, PlayerInteractWithBlockSignal, WorldEvent } from "@serenityjs/world";
import { PlotManager } from "./PlotManager";
import { BlockCoordinates, LevelSoundEventPacket } from "@serenityjs/protocol";
import { NetworkSession } from "@serenityjs/network";


export namespace PacketListener {
    export function loadListeners(serenity: Serenity) {

        serenity.worlds.on(WorldEvent.PlayerInteractWithBlock, (event) => {
            if (event.itemStack?.type.identifier == ItemIdentifier.Stick) {
                handleStickInteraction(event)
                return false
            } else if (event.itemStack?.type.identifier == ItemIdentifier.GoldenShovel) {
                handleShovelInteraction(event)
                return false
            }
        })

    }
}


const PlotCreationTempData: { [playerName: string]: BlockCoordinates } = {}

function handleShovelInteraction(event: PlayerInteractWithBlockSignal) {

    const player = event.player
    if (ItemClickCooldown(player, 1000)) return
    let plot = PlotManager.getPlotFromBlock(event.block.position, event.world.identifier, event.block.dimension.identifier)
    if (plot) {
        player.sendMessage(`§cFailed To Select Point, Point Overlays Claimed Plot.`)
        PlotManager.labelPlot(plot, player)
        return
    }


    const position = event.block.position
    if (!PlotCreationTempData[player.username]) {
        //Plot Creation Point 1
        player.sendMessage(`Selected Point 1 at: ${position.x},${position.y},${position.z}`)
        PlotCreationTempData[player.username] = position
        setTimeout(() => {
            if (PlotCreationTempData[player.username]) {
                player.sendMessage(`Plot Creation Canceled`)
                delete PlotCreationTempData[player.username]
            }
        }, 10000)
    } else {
        const position1 = PlotCreationTempData[player.username]
        const position2 = position
        delete PlotCreationTempData[player.username]
        //Plot Creation Point 2
        player.sendMessage(`Selected Point 1 at: ${position.x},${position.y},${position.z}`)
        player.sendMessage(`Selected Point 2 at: ${position.x},${position.y},${position.z}`)

    }
}

function handleStickInteraction(event: PlayerInteractWithBlockSignal) {

    const player = event.player
    if (ItemClickCooldown(player, 1000)) return

    player.sendMessage("Used Stick")

    const plot = PlotManager.getPlotFromBlock(event.block.position, event.world.identifier, event.block.dimension.identifier)
    if (plot) {
        PlotManager.labelPlot(plot, player)
    }
    PlotManager.getPlotFromBlock(event.block.position, event.world.identifier, event.block.dimension.identifier)
}

const ItemClickCooldownData: { [playerName: string]: number } = {}

function ItemClickCooldown(player: Player, timeMS: number): boolean {
    const itemClickData = ItemClickCooldownData[player.username]
    const currentUnix = Math.round(+new Date() / 1000)
    if (itemClickData) {
        if (itemClickData < currentUnix) {
            delete ItemClickCooldownData[player.username]
            return false
        } else return true
    } else ItemClickCooldownData[player.username] = currentUnix + timeMS
    return false
}