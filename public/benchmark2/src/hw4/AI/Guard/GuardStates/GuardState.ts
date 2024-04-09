import State from "../../../../Wolfie2D/DataTypes/State/State";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import MathUtils from "../../../../Wolfie2D/Utils/MathUtils";
import PlayerActor from "../../../Actors/PlayerActor";
import GuardController from "../GuardController";
import Rect from "../../../../Wolfie2D/Nodes/Graphics/Rect";
import AnimatedSprite from "../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
/**
 * An abstract state for the PlayerController 
 */
export default abstract class GuardState extends State {

    protected parent: GuardController;
	protected owner: AnimatedSprite;
    protected player: AnimatedSprite;

	protected gravity: number;

	public constructor(parent: GuardController, owner: AnimatedSprite){
		super(parent);
		this.owner = owner;

	}

    public abstract onEnter(options: Record<string, any>): void;

    /**
     * Handle game events from the parent.
     * @param event the game event
     */
	public handleInput(event: GameEvent): void {
        switch(event.type) {
            // Default - throw an error
            default: {
                throw new Error(`Unhandled event in GuardState of type ${event.type}`);
            }
        }
	}

	public update(deltaT: number): void {

    }

    public abstract onExit(): Record<string, any>;
}