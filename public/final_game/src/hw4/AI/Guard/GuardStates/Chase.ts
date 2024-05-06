
import Rect from "../../../../Wolfie2D/Nodes/Graphics/Rect";
import AnimatedSprite from "../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import GuardController, { GuardStates } from "../GuardController";
import GuardState from "./GuardState";
import { GuardAnimations } from "../GuardController";
export default class Chase extends GuardState {
	protected levelEndArea: Rect;
	protected player: AnimatedSprite;
	public constructor(parent: GuardController, owner: AnimatedSprite, player:AnimatedSprite, levelEndArea: Rect){
		super(parent, owner)
		this.levelEndArea = levelEndArea;
		this.player = player;
	}


	onEnter(options: Record<string, any>): void {
		
		this.parent.speed = this.parent.MIN_SPEED;
        this.owner.animation.playIfNotAlready(GuardAnimations.PATROL, true);
	}

	update(deltaT: number): void {
        // Call the update method in the parent class - updates the direction the player is facing
        super.update(deltaT);

		let playerVec = this.parent.playerVec;

        // Get the input direction from the player controller
		if(this.parent.getAwareness()||(Math.abs(this.owner.position.x - playerVec.x) > 100) || (Math.abs(this.owner.position.y - playerVec.y) > 100)){
            console.log("FISH LOST");
            this.finished(GuardStates.PATROL);
        }

		this.parent.velocity.y += this.gravity*deltaT; 
		
		
			if(playerVec.x > this.owner.position.x){
				this.parent.velocity.x = (this.parent.speed);
			}else{
				this.parent.velocity.x = -(this.parent.speed);
		
			}
		
		// If we're walking left, flip the sprite
		this.owner.invertX = this.parent.velocity.x < 0;
        if(!this.player.collisionShape.overlaps(this.levelEndArea.collisionShape))
			this.owner.move(this.parent.velocity.scaled(deltaT));
		
	}

	onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}