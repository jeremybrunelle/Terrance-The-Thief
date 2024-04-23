import StateMachineAI from "../../../../Wolfie2D/AI/StateMachineAI";
import AI from "../../../../Wolfie2D/DataTypes/Interfaces/AI";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import NPCActor from "../../../Actors/NPCActor";
import { GuardEvent, ItemEvent } from "../../../Events";
import Inventory from "../../../GameSystems/ItemSystem/Inventory";
import Item from "../../../GameSystems/ItemSystem/Item";
import GuardController from "./GuardController";
import { Patrol, Chase, Stunned, Distracted, GuardStateType } from "./GuardStates/GuardState";
import NPCBehavior from "../NPCBehavior";

/**
 * The AI that controls the Guard. The Guards AI has been configured as a Finite State Machine (FSM)
 * with 4 states; Idle, Moving, Invincible, and Dead.
 */
export default class GuardAI extends StateMachineAI implements AI{

    /** The GameNode that owns this AI */
    public owner: NPCActor;
    /** A set of controls for the Guard */
    public controller: GuardController;
    /** The inventory object associated with the Guard */
    public inventory: Inventory;
    /** The Guards held item */
    public item: Item | null;
    
    public initializeAI(owner: NPCActor, opts: Record<string, any>): void {
        super.initializeAI(owner, opts);
        this.controller = new GuardController(owner);

        // Add the Guards states to it's StateMachine
        this.addState(GuardStateType.PATROL, new Patrol(this, this.owner));
        this.addState(GuardStateType.CHASE, new Chase(this, this.owner));
        this.addState(GuardStateType.STUNNED, new Stunned(this, this.owner));
        this.addState(GuardStateType.DISTRACTED, new Distracted(this, this.owner));
        
        // Initialize the Guards state to Idle
        this.initialize(GuardStateType.PATROL);
        this.receiver.subscribe(GuardEvent.GUARD_STUNNED);
        this.receiver.subscribe(GuardEvent.GUARD_DISTRACTED);
        this.receiver.subscribe(GuardEvent.PLAYER_LOST);
        this.receiver.subscribe(GuardEvent.PLAYER_SPOTTED);
    }

    public activate(options: Record<string, any>): void { }

    public update(deltaT: number): void {
        super.update(deltaT);
        
    }

    public destroy(): void {}

    public handleEvent(event: GameEvent): void {
        switch(event.type) {
            case ItemEvent.STUN_USED: {
                this.handleLaserFiredEvent(event.data.get("actorId"), event.data.get("to"), event.data.get("from"));
                break;
            }
            default: {
                super.handleEvent(event);
                break;
            }
        }
    }

    protected handleLaserFiredEvent(actorId: number, to: Vec2, from: Vec2): void {
        if (this.owner.id !== actorId && this.owner.collisionShape !== undefined ) {
            if (this.owner.collisionShape.getBoundingRect().intersectSegment(to, from.clone().sub(to)) !== null) {
                this.owner.health -= 1;
            }
        }
    }

        protected handleGuardStunned(actorId: number, where: Vec2): void {
            if (this.owner.id !== actorId) {
                this.emitter.fireEvent(GuardEvent.GUARD_STUNNED, {actorId: this.owner.id, where: where});
            }
        }

}