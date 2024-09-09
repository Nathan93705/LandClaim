import { BlockCoordinates } from '@serenityjs/protocol';
import { Block, Dimension, Player, World } from '@serenityjs/world';
import { QuickDB } from 'quick.db';
import { generateEdgePoints, generatePlotPoints } from './Math';
import { Utility } from './Utility';
import { BlockIdentifier } from '@serenityjs/block';

export interface PlotData {
    coordinates: {
        1: BlockCoordinates
        2: BlockCoordinates
    }
    dimension: string,
    world: string,
}

export interface Plots {
    [plotID: number]: PlotData
}

export const db = new QuickDB({ table: "PlotManager" })

export namespace PlotManager {

    let plotsData: Plots = {}
    let currentIndex: number = 0

    export async function loadDB() {
        if (!(await db.get("plots"))) db.set("plots", JSON.stringify({}));
        if (!(await db.get("currentIndex"))) db.set("currentIndex", 1);
        currentIndex = await db.get("currentIndex") as number
        plotsData = JSON.parse(await db.get("plots") as string) as Plots
    }
    export async function unloadDB() {
        await db.set("plots", JSON.stringify(plotsData));
        await db.set("currentIndex", currentIndex + 1);
    }

    export function addPlot(data: PlotData): void | { error: string } {

        const points = generatePlotPoints(data.coordinates[1], data.coordinates[2])
        for (const point of points) if (getPlotFromBlock(point, data.world, data.dimension)) {
            return { error: "Cant Create Plot On Existing Plot" }
        }

        plotsData[currentIndex] = data;
        currentIndex = currentIndex + 1
    }

    export function getAllPlotData(): Plots {
        return plotsData;
    }
    export function setPlot(plotID: number, data: PlotData) {
        if (!plotsData[plotID]) throw Error(`Plot "${plotID}" doesnt exists`)
        plotsData[plotID] = data
    }

    export function getPlot(plotID: number): PlotData | undefined {
        return plotsData[plotID] ? plotsData[plotID] : undefined;
    }

    export function labelPlot(data: PlotData, player: Player) {
        const points = generateEdgePoints(data.coordinates[1], data.coordinates[2])
        const oldBlocks: Block[] = []
        if (player.getWorld().identifier != data.world) throw Error("Player Must Be In The Same World As This Plot")
        if (player.dimension.identifier != data.dimension) throw Error("Player Must Be In The Same Dimension As This Plot")
        const dimension = player.dimension
        for (const point of points) {
            const location = new BlockCoordinates(point.x, player.dimension.getTopmostBlock({ x: point.x, z: point.z, y: 400 }).position.y, point.z)
            oldBlocks.push(dimension.getBlock(point))
            Utility.clientBlock(player, BlockIdentifier.Glowstone, location);
        }
        setTimeout(() => {
            for (const point of points) {
                const block = oldBlocks[points.indexOf(point)!]!
                Utility.clientBlock(player, block.getType().identifier, block.position);
            }
        }, 5000)
    }

    export function getPlotFromBlock(location: BlockCoordinates, worldID: string, dimensionID: string): PlotData | undefined {
        for (const key of Object.keys(plotsData)) {
            const plot = plotsData[Number(key)]!
            if (plot.world != worldID) continue
            if (plot.dimension != dimensionID) continue
            let points = generatePlotPoints(plot.coordinates[1], plot.coordinates[2])
            for (const point of points) if ((point.x == location.x) && (point.z == location.z)) {
                return plot
            }
        }
        return
    }
}
