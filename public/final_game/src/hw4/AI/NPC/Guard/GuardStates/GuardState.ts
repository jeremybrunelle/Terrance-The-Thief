import State from "../../../../../Wolfie2D/DataTypes/State/State";
import GameEvent from "../../../../../Wolfie2D/Events/GameEvent";
import { BattlerEvent, HudEvent, ItemEvent } from "../../../../Events"
import Item from "../../../../GameSystems/ItemSystem/Item";
import GuardAI from "../GuardAI";


export enum GuardAnimationType {
    IDLE = "IDLE",
    PATROL= "PATROL",
}


export enum GuardStateType {
    PATROL = "PATROL",
    CHASE = "CHASE",
    DISTRACTED = "DISTRACTED",
    STUNNED= "STUNNED",
}

export default abstract class GuardState extends State {

    protected parent: GuardAI;
    protected owner: NPCActor;

    public constructor(parent: GuardAI, owner: NPCActor) {
        super(parent);
        this.owner = owner;
    }

    public override onEnter(options: Record<string, any>): void {}
    public override onExit(): Record<string, any> { return {}; }
    public override update(deltaT: number): void {

        // Adjust the angle the player is facing 
        this.parent.owner.rotation = this.parent.controller.rotation;
        // Move the player
        //this.parent.owner.move(this.parent.controller.moveDir);

        // Handle the player trying to pick up an item
        /*
        if (this.parent.controller.pickingUp) {
            // Request an item from the scene
            this.emitter.fireEvent(ItemEvent.ITEM_REQUEST, {node: this.owner, inventory: this.owner.inventory});
        }

        // Handle the player trying to drop an item
        if (this.parent.controller.dropping) {
            
        }

        if (this.parent.controller.useItem) {

        }
        */
    }
    
    public override handleInput(event: GameEvent): void {
        switch(event.type) {
            default: {
                throw new Error(`Unhandled event of type ${event.type} caught in PlayerState!`);
            }
        }
    }

}

import Patrol from "./Patrol";
import Chase from "./Chase"
import Distracted from "./Distracted";
import Stunned from "./Stunned";


import NPCActor from "../../../../Actors/NPCActor";
export { Patrol, Chase,Distracted, Stunned} 