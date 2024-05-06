import Updateable from "../../../Wolfie2D/DataTypes/Interfaces/Updateable";
import Scene from "../../../Wolfie2D/Scene/Scene";
import Color from "../../../Wolfie2D/Utils/Color";
import Label from "../../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import Positioned from "../../../Wolfie2D/DataTypes/Interfaces/Positioned";
import Unique from "../../../Wolfie2D/DataTypes/Interfaces/Unique";
import Lockpick from "../Puzzles/Lockpick";

/*
interface Loudness {
    get loudness(): number;
    get maxLoudness(): number;
}
*/
interface LockpickOptions {
    size: Vec2;
    offset: Vec2;

}

/**
 * A UI component that's suppossed to represent a healthbar
 */
export default class LockpickHUD implements Updateable {

    /** The scene and layer in the scene the healthbar is in */
    protected scene: Scene;
    protected layer: string;

    /** The GameNode that owns this healthbar */
    protected owner: Lockpick & Positioned & Unique;

    /** The size and offset of the healthbar from it's owner's position */
    protected size: Vec2;
    protected offset: Vec2;
    protected completeProgress: number;
    /** The actual healthbar (the part with color) */
    protected loudnessBar: Label;
    /** The healthbars background (the part with the border) */
    protected loudnessBarBg: Label;

    public constructor(scene: Scene, owner: Lockpick & Positioned & Unique, layer: string, options: LockpickOptions) {
        this.scene = scene;
        this.layer = layer;
        this.owner = owner;

        this.size = options.size;
        this.offset = options.offset;
        this.completeProgress = 15;
        this.loudnessBar = <Label>this.scene.add.uiElement(UIElementType.LABEL, layer, {position: this.owner.position.clone().add(this.offset), text: ""});
        this.loudnessBar.size.copy(this.size);
        this.loudnessBar.backgroundColor = Color.RED;

        this.loudnessBarBg = <Label>this.scene.add.uiElement(UIElementType.LABEL, layer, {position: this.owner.position.clone().add(this.offset), text: ""});
        this.loudnessBarBg.backgroundColor = Color.TRANSPARENT;
        this.loudnessBarBg.borderColor = Color.BLACK;
        this.loudnessBarBg.borderWidth = 1;
        this.loudnessBarBg.size.copy(this.size);
    }

    /**
     * Updates the healthbars position according to the position of it's owner
     * @param deltaT 
     */
    public update(deltaT: number): void {
        if(this.owner.status){
            return;
        }
        this.loudnessBar.position =new Vec2(150, 35);
        this.loudnessBarBg.position= new Vec2(150, 35);

        let scale = this.scene.getViewScale();
        this.loudnessBar.scale.scale(scale);
        this.loudnessBarBg.scale.scale(scale);

        let unit = this.loudnessBarBg.size.x / this.owner.needed;
		this.loudnessBar.size.set(this.loudnessBarBg.size.x - unit * (this.owner.needed - this.owner.progress), this.loudnessBarBg.size.y);
		this.loudnessBar.position.set(this.loudnessBarBg.position.x - (unit / scale / 2) * (this.owner.needed - this.owner.progress), this.loudnessBarBg.position.y);

		this.loudnessBar.backgroundColor = this.owner.progress < this.owner.needed * 1/4 ? Color.RED : this.owner.progress < this.owner.needed * 3/4 ? Color.YELLOW : Color.GREEN;
    }

    get ownerId(): number { return this.owner.id; }

    set visible(visible: boolean) {
        this.loudnessBar.visible = visible;
        this.loudnessBarBg.visible = visible;
    }
    

}