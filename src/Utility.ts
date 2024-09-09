import { BlockIdentifier, BlockPermutation } from "@serenityjs/block"
import { BlockCoordinates, UpdateBlockPacket } from "@serenityjs/protocol"
import { Player } from "@serenityjs/world"

export namespace Utility {
    export function clientBlock(player: Player, blockId: BlockIdentifier, location: BlockCoordinates) {
        let packet = new UpdateBlockPacket()
        packet.position = location
        packet.networkBlockId = BlockPermutation.resolve(blockId).network
        packet.flags = 0
        packet.layer = 0
        packet.offset = 0
        player.session.send(packet)
    }
}