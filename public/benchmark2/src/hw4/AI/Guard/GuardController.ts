import StateMachineAI from "../../../Wolfie2D/AI/StateMachineAI";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import OrthogonalTilemap from "../../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import MathUtils from "../../../Wolfie2D/Utils/MathUtils";
import { Events } from "../../Events";

import Timer from "../../../Wolfie2D/Timing/Timer";
import Rect from "../../../Wolfie2D/Nodes/Graphics/Rect";
import Chase from "./GuardStates/Chase";
import Patrol from "./GuardStates/Patrol";

/**
 * Animation keys for the player spritesheet
 */
export const GuardAnimations = {
    IDLE: "IDLE",
    WALK: "WALK",
    PATROL: "PATROL",
    CHASE: "CHASE",   
} as const

/**
 * Tween animations the player can player.
 */

/**
 * Keys for the states the PlayerController can be in.
 */
export const GuardStates = {
    PATROL: "PATROL",
    CHASE: "CHASE",
    ALERT: "ALERT",
} as const

/**
 * The controller that controls the player.
 */
export default class GuardController extends StateMachineAI {
    public readonly MAX_SPEED: number = 100;
    public readonly MIN_SPEED: number = 75;

    /** Health and max health for the player */
    /*
    protected _health: number;
    protected _maxHealth: number;
*/
    /** The players game node */
    protected owner: AnimatedSprite;

    protected _velocity: Vec2;
	protected _speed: number;

    protected tilemap: OrthogonalTilemap;

    protected player: AnimatedSprite;
    public playerVec: Vec2;
    // protected cannon: Sprite;
    protected walkFlag: boolean;
    protected levelEndArea: Rect;

    protected isPlayerHiding: boolean;

    
    public initializeAI(owner: AnimatedSprite, options: Record<string, any>){
        this.owner = owner;



        this.tilemap = this.owner.getScene().getTilemap(options.tilemap) as OrthogonalTilemap;
        this.speed = this.MIN_SPEED;
        this.velocity = Vec2.ZERO;
        this.player = options.player;
        this.levelEndArea = options.levelEndArea;
        this.playerVec = this.player.position;
        this.walkFlag = false;

        // Add the different states the player can be in to the PlayerController 
        this.addState(GuardStates.PATROL, new Patrol(this, this.owner, this.player, this.levelEndArea, 200));
        this.addState(GuardStates.CHASE, new Chase(this, this.owner, this.player, this.levelEndArea));

        this.receiver.subscribe(Events.IN_HIDING);
        this.receiver.subscribe(Events.NOT_HIDING);
        this.receiver.subscribe(Events.PLAYER_GUARD_HIT);
        this.initialize(GuardStates.PATROL);
    }

    /** 
	 * Get the inputs from the keyboard, or Vec2.Zero if nothing is being pressed
	 */
    public get inputDir(): Vec2 {
        let direction = Vec2.ZERO;
		return direction;
    }
    /** 
     * Gets the direction of the mouse from the player's position as a Vec2
     */
    //public get faceDir(): Vec2 { return this.owner.position.dirTo(Input.getGlobalMousePosition()); }

    public update(deltaT: number): void {
		super.update(deltaT);
        while (this.receiver.hasNextEvent()) {
            this.handleEvent(this.receiver.getNextEvent());
        }
        
        if (this.owner.position.distanceTo(this.player.position) < 50) {
            this.handleChase();
        }else{
            this.changeState(GuardStates.PATROL);
        }

        if(this.owner.collisionShape.overlaps(this.player.collisionShape)){
            this.handlePlayerGuardCollision();   
        }
        
	}
    protected handleChase(): void {
        if(this.walkFlag == false){
        this.changeState(GuardStates.CHASE);
        this.walkFlag = true;
        }
    }

    public handleEvent(event: GameEvent): void {
        switch(event.type){
            case(Events.IN_HIDING):
                this.isPlayerHiding = true;
                break;
            case Events.NOT_HIDING: {
                this.isPlayerHiding = false
                break;
            }    
        }
    }


   
    protected handlePlayerGuardCollision(): void {
        this.emitter.fireEvent(Events.PLAYER_GUARD_HIT);
       
    }
    public get velocity(): Vec2 { return this._velocity; }
    public set velocity(velocity: Vec2) { this._velocity = velocity; }

    public get speed(): number { return this._speed; }
    public set speed(speed: number) { this._speed = speed; }

    public getAwareness():boolean {return this.isPlayerHiding}
}