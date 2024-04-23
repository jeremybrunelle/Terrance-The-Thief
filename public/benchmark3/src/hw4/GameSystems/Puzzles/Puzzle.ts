import Unique from "../../../Wolfie2D/DataTypes/Interfaces/Unique";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import Emitter from "../../../Wolfie2D/Events/Emitter";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import Layer from "../../../Wolfie2D/Scene/Layer";
import Scene from "../../../Wolfie2D/Scene/Scene";


export default abstract class Puzzle implements Unique {

    protected sprite: Sprite;
    protected emitter: Emitter;
    protected completed: boolean;
    protected complettionProgress: number;


    protected constructor(sprite: Sprite){ 
        this.sprite = sprite;
        this.emitter = new Emitter();
        this.completed = false;
        this.complettionProgress = 0;
    }

    public get status(): boolean { return this.completed; }
    public set status(value: boolean) { this.completed = value; }

    public get progress(): number { return this.complettionProgress; }
    public set progress(value: number) { this.complettionProgress = value; }


    public get relativePosition(): Vec2 { return this.sprite.relativePosition; }

    public get id(): number { return this.sprite.id; }

    public get position(): Vec2 { return this.sprite.position; }

    public get visible(): boolean { return this.sprite.visible; }
    public set visible(value: boolean) { this.sprite.visible = value; }


    

}