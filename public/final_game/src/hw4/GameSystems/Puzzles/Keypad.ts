import Unique from "../../../Wolfie2D/DataTypes/Interfaces/Unique";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import Emitter from "../../../Wolfie2D/Events/Emitter";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import Layer from "../../../Wolfie2D/Scene/Layer";
import Scene from "../../../Wolfie2D/Scene/Scene";
import Puzzle from "./Puzzle";
import AABB from "../../../Wolfie2D/DataTypes/Shapes/AABB";

/*

two ideas:
 a real lockpicking puzzle where you actually rotate a lockpick
OR
you press e which will fill up a bar and the faster you fill up the bar the more it incrases the loudness of the player

*/
export default class Keypad extends Puzzle {
    pin: number;
    boundary: AABB;
    public constructor(sprite: Sprite) {
        super(sprite);
        this.boundary = new AABB();
        this.pin=1234;
    }

    updateBoundary(): void {
		this.boundary.center.set(this.position.x, this.position.y);
		this.boundary.halfSize.set(12, 12);
	}
    
        
        public getPin(): number {
            return this.pin;
        }
    
        public setPin(pin: number): void {
            this.pin = pin;
        }

        
        public checkPin(pin: number): void {
            if (this.pin == pin) {
                this.completed = true;
            }
        }
    


}