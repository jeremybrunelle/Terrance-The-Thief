import AABB from "../../../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import Sprite from "../../../../Wolfie2D/Nodes/Sprites/Sprite";
import HW4Scene from "../../../Scenes/HW4Scene";
import Item from "../Item";

export default class Key extends Item {

    boundary: AABB;

    public constructor(sprite: Sprite) {
        super(sprite);
        this.boundary = new AABB();
    }

    updateBoundary(): void {
		this.boundary.center.set(this.position.x, this.position.y);
		this.boundary.halfSize.set(16, 16);
	}

}