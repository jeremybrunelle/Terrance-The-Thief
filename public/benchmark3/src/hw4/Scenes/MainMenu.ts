import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../Wolfie2D/Scene/Layer";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import MainHW4Scene from "./Level1";
import ControlsScene from "./ControlsScene";
import HelpScene from "./HelpScene";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import Level1 from "./Level1";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
export default class MainMenu extends Scene {
    // Layers, for multiple main menu screens
    private mainMenu: Layer;
    private logo: Layer;
    private about: Layer;
    private control: Layer;

    public override loadScene(){ 
        this.load.audio("levelMusic", "hw4_assets/audio/MainMenu.mp3");
        this.load.image("logo", "hw4_assets/sprites/LOGO (1).png");
    }

    
    public startScene(){
        const center = this.viewport.getCenter();
        

        // The main menu
        this.mainMenu = this.addUILayer("mainMenu");
        this.mainMenu.setDepth(2);
        this.logo = this.addUILayer("logo");
        this.logo.setDepth(0);
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "levelMusic", loop: true, holdReference: true});

        let sprite = this.add.sprite("logo", "logo");
        sprite.scale = new Vec2(8.3, 8.3);
        sprite.position = new Vec2(500, 500);

        const play = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x + 280, center.y - 275), text: "Play"});
        play.size.set(200, 50);
        play.borderWidth = 2;
        play.borderColor = Color.WHITE;
        play.backgroundColor = Color.TRANSPARENT;
        play.onClickEventId = "play";

        const controls = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x + 280, center.y - 175), text: "Controls"});
        controls.size.set(200, 50);
        controls.borderWidth = 2;
        controls.borderColor = Color.WHITE;
        controls.backgroundColor = Color.TRANSPARENT;
        controls.onClickEventId = "controls";

        const help = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x + 280, center.y - 75), text: "How to Play"});
        help.size.set(200, 50);
        help.borderWidth = 2;
        help.borderColor = Color.WHITE;
        help.backgroundColor = Color.TRANSPARENT;
        help.onClickEventId = "help";

        
        

        // Subscribe to the button events
        this.receiver.subscribe("play");
        this.receiver.subscribe("controls");
        this.receiver.subscribe("help");
    }

    public updateScene(){
        while(this.receiver.hasNextEvent()){
            this.handleEvent(this.receiver.getNextEvent());
        }
    }

    public handleEvent(event: GameEvent): void {
        switch(event.type) {
            case "play": {
                this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "levelMusic"});
                this.sceneManager.changeToScene(Level1);
                break;
            }
            case "controls": {
                this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "levelMusic"});
                this.sceneManager.changeToScene(ControlsScene);
                break;
            }
            case "help": {
                this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "levelMusic"});
                this.sceneManager.changeToScene(HelpScene);
                break;
            }          
        }
    }
}