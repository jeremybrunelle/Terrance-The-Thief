import GameEvent from "../../../../../Wolfie2D/Events/GameEvent";
import Timer from "../../../../../Wolfie2D/Timing/Timer";
import NPCActor from "../../../../Actors/NPCActor";
import GuardAI from "../GuardAI";
import GuardState, { GuardStateType } from "./GuardState";

export default class Stunned extends GuardState {

    protected timer: Timer;

    constructor(parent: GuardAI, owner: NPCActor) {
        super(parent, owner);
        this.timer = new Timer(100, () => this.finished(GuardStateType.PATROL));
    }

    public override update(deltaT: number): void {}

    public override handleInput(event: GameEvent): void {
        switch(event.type) {
            default: {
                super.handleInput(event);
                break;
            }
        }
    }

    public override onEnter(options: Record<string, any>): void {
        this.timer.start();
    }

    public override onExit(): Record<string, any> { 
        return {};
    }
}