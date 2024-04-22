import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Scene from "../../Wolfie2D/Scene/Scene";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import LaserGun from "../GameSystems/ItemSystem/Items/LaserGun";
import Healthpack from "../GameSystems/ItemSystem/Items/Healthpack";
import Battler from "../GameSystems/BattleSystem/Battler";
import Input from "../../Wolfie2D/Input/Input";
import Level1 from "./Level1";
import Level2 from "./Level2";
import Level3 from "./Level3";
import Level4 from "./Level4";
import Level5 from "./Level5";
import Level6 from "./Level6";


export default abstract class HW4Scene extends Scene {

    public abstract getBattlers(): Battler[];

    public abstract getWalls(): OrthogonalTilemap;

    public abstract getHealthpacks(): Healthpack[];

    public abstract getLaserGuns(): LaserGun[];

    public abstract isTargetVisible(position: Vec2, target: Vec2): boolean;
    
}