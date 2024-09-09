import { BlockCoordinates } from "@serenityjs/protocol";

export function generatePlotPoints(corner1: BlockCoordinates, corner2: BlockCoordinates): BlockCoordinates[] {
    const
        minX = Math.min(corner1.x, corner2.x),
        maxX = Math.max(corner1.x, corner2.x),
        minZ = Math.min(corner1.z, corner2.z),
        maxZ = Math.max(corner1.z, corner2.z);

    const points: BlockCoordinates[] = [];
    for (let Xi = minX; Xi <= maxX; Xi++) {
        for (let Zi = minZ; Zi <= maxZ; Zi++) {
            points.push(new BlockCoordinates(Xi, 0, Zi));
        }
    }

    return points;
}



export function generateEdgePoints(corner1: BlockCoordinates, corner2: BlockCoordinates): BlockCoordinates[] {
    const
        minX = Math.min(corner1.x, corner2.x),
        maxX = Math.max(corner1.x, corner2.x),
        minZ = Math.min(corner1.z, corner2.z),
        maxZ = Math.max(corner1.z, corner2.z);

    let points: BlockCoordinates[] = [];

    // Top and bottom edges
    for (let Xi = minX; Xi < maxX; Xi++) {
        points.push(new BlockCoordinates(Xi, 0, minZ)); // Top edge original point
        points.push(new BlockCoordinates(Xi, 0, maxZ)); // Bottom edge original point
    }
    points.push(new BlockCoordinates(maxX, 0, minZ)); // Last point on the top edge
    points.push(new BlockCoordinates(maxX, 0, maxZ)); // Last point on the bottom edge

    // Left and right edges (excluding corners already added)
    for (let Zi = minZ; Zi < maxZ; Zi++) {
        points.push(new BlockCoordinates(minX, 0, Zi)); // Left edge original point
        points.push(new BlockCoordinates(maxX, 0, Zi)); // Right edge original point
    }
    points.push(new BlockCoordinates(minX, 0, maxZ)); // Last point on the left edge
    points.push(new BlockCoordinates(maxX, 0, maxZ)); // Last point on the right edge
    return points;
}

export function getSquareCorners(corner1: BlockCoordinates, corner2: BlockCoordinates): BlockCoordinates[] {
    // Calculate the center of the square
    const center = {
        x: (corner1.x + corner2.x) / 2,
        z: (corner1.z + corner2.z) / 2
    };

    // Calculate the side length of the square
    const diagonal = Math.sqrt(Math.pow(corner2.x - corner1.x, 2) + Math.pow(corner2.z - corner1.z, 2));
    const sideLength = diagonal / Math.sqrt(2);

    // Vector from corner1 to the center
    const vector = {
        x: center.x - corner1.x,
        z: center.z - corner1.z
    };

    // Normalize the vector
    const magnitude = Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.z, 2));
    const unitVector = {
        x: vector.x / magnitude,
        z: vector.z / magnitude
    };

    // Perpendicular vector
    const perpendicularVector = {
        x: -unitVector.z,
        z: unitVector.x
    };

    // Calculate the other two corners
    const halfSide = sideLength / 2;
    const corner3 = new BlockCoordinates(center.x + halfSide * perpendicularVector.x, 0, center.z + halfSide * perpendicularVector.z)

    const corner4 = new BlockCoordinates(center.x - halfSide * perpendicularVector.x, 0, center.z - halfSide * perpendicularVector.z)

    return [new BlockCoordinates(corner1.x, 0, corner1.z), new BlockCoordinates(corner2.x, 0, corner2.z), corner3, corner4];
}
