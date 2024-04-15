import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Input from "../../Wolfie2D/Input/Input";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import MainMenu from "./MainMenu";

export default class HelpScene extends Scene {

    startScene() {
        const center = this.viewport.getCenter();

        this.addUILayer("primary");

        const button = this.add.uiElement(UIElementType.BUTTON, "primary", {position: new Vec2(center.x, center.y - 200), text: "Main Menu"});
        button.size.set(200, 50);
        button.borderWidth = 2;
        button.borderColor = Color.WHITE;
        button.backgroundColor = Color.TRANSPARENT;
        button.onClickEventId = "menu";

        this.receiver.subscribe("menu");

        const line1 = <Label>this.add.uiElement(UIElementType.LABEL, "primary", {position: new Vec2(center.x, center.y-100), text: "How to Play:"});
        const line2 = <Label>this.add.uiElement(UIElementType.LABEL, "primary", {position: new Vec2(center.x, center.y-50), text: "Collect the key in order to open the safe and collect the money."});
        const line3 = <Label>this.add.uiElement(UIElementType.LABEL, "primary", {position: new Vec2(center.x, center.y), text: "Avoid electricity by activating off switches."});
        const line4 = <Label>this.add.uiElement(UIElementType.LABEL, "primary", {position: new Vec2(center.x, center.y+50), text: "Use vents to move around the map and avoid guards."});
        const line5 = <Label>this.add.uiElement(UIElementType.LABEL, "primary", {position: new Vec2(center.x, center.y+100), text: "Use lockers to make yourself invisible."});
        //const line6 = <Label>this.add.uiElement(UIElementType.LABEL, "primary", {position: new Vec2(center.x, center.y), text: "Controls:"});
        //const line7 = <Label>this.add.uiElement(UIElementType.LABEL, "primary", {position: new Vec2(center.x, center.y), text: "Controls:"});


        line1.textColor = Color.WHITE;
        line2.textColor = Color.WHITE;
        line3.textColor = Color.WHITE;
        line4.textColor = Color.WHITE;
        line5.textColor = Color.WHITE;
        //line6.textColor = Color.WHITE;
        //line7.textColor = Color.WHITE;

    }

    public updateScene(){
        while(this.receiver.hasNextEvent()){
            this.handleEvent(this.receiver.getNextEvent());
        }
    }

    public handleEvent(event: GameEvent): void {
        switch(event.type) {
            case "menu": {
                this.sceneManager.changeToScene(MainMenu);
                break;
            }
        }
    }
}