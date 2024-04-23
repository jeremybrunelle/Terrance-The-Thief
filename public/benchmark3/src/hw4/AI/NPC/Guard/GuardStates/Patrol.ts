import Vec2 from "../../../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../../../Wolfie2D/Events/GameEvent";
import { GuardAnimationType, GuardStateType } from "./GuardState";
import GuardState from "./GuardState";

export default class Patrol extends GuardState {

    public override onEnter(options: Record<string, any>): void {
        this.parent.owner.animation.playIfNotAlready(GuardAnimationType.PATROL, true);
    }

    public override handleInput(event: GameEvent): void {
        switch(event.type) {
            default: {
                super.handleInput(event);
                break;
            }
        }
    }

    public override update(deltaT: number): void {
        super.update(deltaT);

    }

    public override onExit(): Record<string, any> { 
        return {}; 
    }
    
}