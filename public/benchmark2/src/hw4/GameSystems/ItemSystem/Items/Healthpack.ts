import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import Sprite from "../../../../Wolfie2D/Nodes/Sprites/Sprite";
import HW4Scene from "../../../Scenes/HW4Scene";
import Item from "../Item";
import AABB from "../../../../Wolfie2D/DataTypes/Shapes/AABB";


export default class Healthpack extends Item {
    
    protected hp: number;
    boundary: AABB;

    public constructor(sprite: Sprite) {
        super(sprite);
        this.hp = 5;
        this.boundary = new AABB();
    }

    updateBoundary(): void {
		this.boundary.center.set(this.position.x, this.position.y);
		this.boundary.halfSize.set(6, 6);
	}

    public get health(): number { return this.hp; }
    public set health(hp: number) { this.hp = hp; }


}