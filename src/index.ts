import { Serenity } from "@serenityjs/serenity";
import { PacketListener } from "./PacketListener";
import { Plugin } from "@serenityjs/plugins";
import { WorldEvent } from "@serenityjs/world";
import { PlotData, PlotManager } from "./PlotManager";
import { BlockCoordinates } from "@serenityjs/protocol";


export function onInitialize(serenity: Serenity, { logger }: Plugin): void {
	PacketListener.loadListeners(serenity)
	logger.info(`Loading Plot Data`)
	PlotManager.loadDB()

	serenity.worlds.on(WorldEvent.PlayerPlaceBlock, ev => {
		const data: PlotData = {
			coordinates: {
				1: new BlockCoordinates(10, 0, 10),
				2: new BlockCoordinates(0, 0, 0)
			},
			dimension: ev.player.dimension.identifier,
			world: ev.player.getWorld().identifier
		}
		PlotManager.addPlot(data)
	})
	logger.color(`#329ba8`)
	logger.log(`Listeners Loaded`)
}


export function onShutdown(_: Serenity, { logger }: Plugin): void {
	logger.info(`Saved Plot Data`)
	PlotManager.unloadDB()
}


