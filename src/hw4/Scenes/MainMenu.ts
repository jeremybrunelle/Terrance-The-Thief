import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../Wolfie2D/Scene/Layer";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import MainHW4Scene from "./MainHW4Scene";
import ControlsScene from "./ControlsScene";
import GameEvent from "../../Wolfie2D/Events/GameEvent";

export default class MainMenu extends Scene {
    // Layers, for multiple main menu screens
    private mainMenu: Layer;
    private about: Layer;
    private control: Layer;

    public loadScene(){}

    public startScene(){
        const center = this.viewport.getCenter();

        // The main menu
        this.mainMenu = this.addUILayer("mainMenu");

        const play = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x, center.y - 100), text: "Play"});
        play.size.set(200, 50);
        play.borderWidth = 2;
        play.borderColor = Color.WHITE;
        play.backgroundColor = Color.TRANSPARENT;
        play.onClickEventId = "play";

        const controls = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x, center.y), text: "Controls"});
        controls.size.set(200, 50);
        controls.borderWidth = 2;
        controls.borderColor = Color.WHITE;
        controls.backgroundColor = Color.TRANSPARENT;
        controls.onClickEventId = "controls";
        

        // Subscribe to the button events
        this.receiver.subscribe("play");
        this.receiver.subscribe("controls");
    }

    public updateScene(){
        while(this.receiver.hasNextEvent()){
            this.handleEvent(this.receiver.getNextEvent());
        }
    }

    public handleEvent(event: GameEvent): void {
        switch(event.type) {
            case "play": {
                this.sceneManager.changeToScene(MainHW4Scene);
                break;
            }
            case "controls": {
                this.sceneManager.changeToScene(ControlsScene);
                break;
            }
        }
    }
}