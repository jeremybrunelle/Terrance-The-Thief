import PositionGraph from "../../Wolfie2D/DataTypes/Graphs/PositionGraph";
import Actor from "../../Wolfie2D/DataTypes/Interfaces/Actor";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import GameNode from "../../Wolfie2D/Nodes/GameNode";
import GameOver from "../Scenes/GameOver"
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import Line from "../../Wolfie2D/Nodes/Graphics/Line";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import Navmesh from "../../Wolfie2D/Pathfinding/Navmesh";
import DirectStrategy from "../../Wolfie2D/Pathfinding/Strategies/DirectStrategy";
import RenderingManager from "../../Wolfie2D/Rendering/RenderingManager";
import SceneManager from "../../Wolfie2D/Scene/SceneManager";
import Viewport from "../../Wolfie2D/SceneGraph/Viewport";
import Timer from "../../Wolfie2D/Timing/Timer";
import Color from "../../Wolfie2D/Utils/Color";
import MathUtils from "../../Wolfie2D/Utils/MathUtils";
import NPCActor from "../Actors/NPCActor";
import PlayerActor from "../Actors/PlayerActor";
import GuardBehavior from "../AI/NPC/NPCBehavior/GaurdBehavior";
import PlayerAI from "../AI/Player/PlayerAI";
import { ItemEvent, PlayerEvent, BattlerEvent } from "../Events";
import Battler from "../GameSystems/BattleSystem/Battler";
import BattlerBase from "../GameSystems/BattleSystem/BattlerBase";
import HealthbarHUD from "../GameSystems/HUD/HealthbarHUD";
import InventoryHUD from "../GameSystems/HUD/InventoryHUD";
import Inventory from "../GameSystems/ItemSystem/Inventory";
import Item from "../GameSystems/ItemSystem/Item";
import Healthpack from "../GameSystems/ItemSystem/Items/Healthpack";
import LaserGun from "../GameSystems/ItemSystem/Items/LaserGun";
import Key from "../GameSystems/ItemSystem/Items/Key";
import Vent from "../GameSystems/ItemSystem/Items/Vent";
import Safe from "../GameSystems/ItemSystem/Items/Safe";
import Obstacle from "../GameSystems/ItemSystem/Items/Obstacle";
import Locker from "../GameSystems/ItemSystem/Items/Locker";
import Electricity from "../GameSystems/ItemSystem/Items/Electricity";
import Off from "../GameSystems/ItemSystem/Items/Off";
import Switch from "../GameSystems/ItemSystem/Items/Switch";
import { ClosestPositioned } from "../GameSystems/Searching/HW4Reducers";
import BasicTargetable from "../GameSystems/Targeting/BasicTargetable";
import Position from "../GameSystems/Targeting/Position";
import AstarStrategy from "../Pathfinding/AstarStrategy";
import HW4Scene from "./HW4Scene";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import NavigationPath from "../../Wolfie2D/Pathfinding/NavigationPath";

const BattlerGroups = {
    RED: 1,
    BLUE: 2
} as const;

export default class MainHW4Scene extends HW4Scene {

    /** GameSystems in the HW4 Scene */
    private inventoryHud: InventoryHUD;

    /** All the battlers in the HW4Scene (including the player) */
    private player;
    private playerHealthbar: HealthbarHUD;
    private battlers: (Battler & Actor)[];
    /** Healthbars for the battlers */
    private healthbars: Map<number, HealthbarHUD>;

    private moneyLabel: Label;
    public money: number = 0;

    private bases: BattlerBase[];
    private guards;
    private seenFlag: boolean = false;
    private healthTimer: number;
    private healthpacks: Array<Healthpack>;
    private laserguns: Array<LaserGun>;
    private keys: Array<Key>;
    private vents: Array<Vent>;
    private safes: Array<Safe>;
    private obstacles: Array<Obstacle>;
    private lockers: Array<Locker>;
    private electricities: Array<Electricity>;
    private offs: Array<Off>;
    private switches: Array<Switch>;

    // The wall layer of the tilemap
    private walls: OrthogonalTilemap;

    // The position graph for the navmesh
    private graph: PositionGraph;

    public constructor(viewport: Viewport, sceneManager: SceneManager, renderingManager: RenderingManager, options: Record<string, any>) {
        super(viewport, sceneManager, renderingManager, options);

        this.battlers = new Array<Battler & Actor>();
        this.healthbars = new Map<number, HealthbarHUD>();
        this.healthTimer = 0;
        this.laserguns = new Array<LaserGun>();
        this.healthpacks = new Array<Healthpack>();
        this.keys = new Array<Key>();
        this.vents = new Array<Vent>();
        this.safes = new Array<Safe>();
        this.obstacles = new Array<Obstacle>();
        this.lockers = new Array<Locker>();
        this.electricities = new Array<Electricity>();
        this.offs = new Array<Off>();
        this.switches = new Array<Switch>();
    }

    /**
     * @see Scene.update()
     */
    public override loadScene() {
        // Load the player and enemy spritesheets
        this.load.spritesheet("player1", "hw4_assets/spritesheets/player1.json");

        // Load in the enemy sprites

        // Load the tilemap
        this.load.tilemap("level", "hw4_assets/tilemaps/HW4Tilemap.json");

        // Load the enemy locations

        // Load the healthpack and lasergun loactions
        this.load.object("healthpacks", "hw4_assets/data/items/healthpacks.json");
        this.load.object("laserguns", "hw4_assets/data/items/laserguns.json");
        this.load.object("keys", "hw4_assets/data/items/keys.json");
        this.load.object("vents", "hw4_assets/data/items/vents.json");
        this.load.object("safes", "hw4_assets/data/items/safes.json");
        this.load.object("obstacles", "hw4_assets/data/items/obstacles.json");
        this.load.object("lockers", "hw4_assets/data/items/lockers.json");
        this.load.object("electricities", "hw4_assets/data/items/electricities.json");
        this.load.object("switches", "hw4_assets/data/items/switches.json");
        this.load.object("offs", "hw4_assets/data/items/offs.json");

        // Load the healthpack, inventory slot, and laser gun sprites
        this.load.image("healthpack", "hw4_assets/sprites/healthpack.png");
        this.load.image("inventorySlot", "hw4_assets/sprites/inventory.png");
        this.load.image("laserGun", "hw4_assets/sprites/laserGun.png");
        this.load.image("key", "hw4_assets/sprites/key.png");
        this.load.image("vent", "hw4_assets/sprites/vent.png");
        this.load.image("safe", "hw4_assets/sprites/safe.png");
        this.load.image("obstacle", "hw4_assets/sprites/obstacle.png");
        this.load.image("locker", "hw4_assets/sprites/locker.png");
        this.load.image("electricity", "hw4_assets/sprites/electricity.png");
        this.load.image("switch", "hw4_assets/sprites/switch.png");
        this.load.image("off", "hw4_assets/sprites/off.png");
    }
    /**
     * @see Scene.startScene
     */
    public override startScene() {
        // Add in the tilemap
        let tilemapLayers = this.add.tilemap("level");

        // Get the wall layer
        this.walls = <OrthogonalTilemap>tilemapLayers[1].getItems()[0];

        // Set the viewport bounds to the tilemap
        let tilemapSize: Vec2 = this.walls.size;

        this.viewport.setBounds(0, 0, tilemapSize.x, tilemapSize.y);
        this.viewport.setZoomLevel(2);

        this.initLayers();
        
        // Create the player
        this.initializePlayer();
        this.initializeItems();
        this.initializeUI();

        this.initializeNavmesh();

        // Create the NPCS
        this.initializeNPCs();

        // Subscribe to relevant events
        this.receiver.subscribe("healthpack");
        this.receiver.subscribe("enemyDied");
        this.receiver.subscribe(ItemEvent.ITEM_REQUEST);

        // Add a UI for health
        this.addUILayer("health");


        this.receiver.subscribe(PlayerEvent.PLAYER_KILLED);
        this.receiver.subscribe(BattlerEvent.BATTLER_KILLED);
        this.receiver.subscribe(BattlerEvent.BATTLER_RESPAWN);
    }
    /**
     * @see Scene.updateScene
     */
    public override updateScene(deltaT: number): void {
        this.handleCollisions();

        for (let locker of this.lockers) {
            if (locker.visible && this.player.collisionShape.overlaps(locker.boundary)) {
                this.player.visible = false
            }
            else {
                this.player.visible = true;
            }
        }

        while (this.receiver.hasNextEvent()) {
            this.handleEvent(this.receiver.getNextEvent());
        }
        this.handlePlayerKilled()
        this.inventoryHud.update(deltaT);
        this.playerHealthbar.update(deltaT);
        this.healthbars.forEach(healthbar => healthbar.update(deltaT));
        this.enterChase();
        if(this.seenFlag){
            if(this.healthTimer == 15){
            this.player.health -= .25;
            this.healthTimer = 0;
            }
            this.healthTimer++;
        }
    }

    /**
     * Handle events from the rest of the game
     * @param event a game event
     */
    public handleEvent(event: GameEvent): void {
        switch (event.type) {
            case BattlerEvent.BATTLER_KILLED: {
                this.handleBattlerKilled(event);
                break;
            }
            case BattlerEvent.BATTLER_RESPAWN: {
                break;
            }
            case ItemEvent.ITEM_REQUEST: {
                this.handleItemRequest(event.data.get("node"), event.data.get("inventory"));
                break;
            }
            default: {
                throw new Error(`Unhandled event type "${event.type}" caught in HW4Scene event handler`);
            }
        }
    }

    protected handleItemRequest(node: GameNode, inventory: Inventory): void {
        let items: Item[] = new Array<Item>(...this.healthpacks, ...this.laserguns).filter((item: Item) => {
            return item.inventory === null && item.position.distanceTo(node.position) <= 100;
        });

        if (items.length > 0) {
            inventory.add(items.reduce(ClosestPositioned(node)));
        }
    }

    /**
     * Handles an NPC being killed by unregistering the NPC from the scenes subsystems
     * @param event an NPC-killed event
     */
    protected handleBattlerKilled(event: GameEvent): void {
        let id: number = event.data.get("id");
        let battler = this.battlers.find(b => b.id === id);

        if (battler) {
            battler.battlerActive = false;
            this.healthbars.get(id).visible = false;
        }
        
    }

    protected handlePlayerKilled(): void {
        if (this.player.health <= 0) {
            this.sceneManager.changeToScene(GameOver);
        }
    }

    /** Initializes the layers in the scene */
    protected initLayers(): void {
        this.addLayer("primary", 10);
        this.addUILayer("slots");
        this.addUILayer("items");
        this.getLayer("slots").setDepth(1);
        this.getLayer("items").setDepth(2);
    }




    /**
     * Initializes the player in the scene
     */
    protected initializePlayer(): void {
        this.player = this.add.animatedSprite(PlayerActor, "player1", "primary");
        this.player.position.set(40, 40);
        this.player.battleGroup = 2;

        this.player.health = 10;
        this.player.maxHealth = 10;

        this.player.inventory.onChange = ItemEvent.INVENTORY_CHANGED
        this.inventoryHud = new InventoryHUD(this, this.player.inventory, "inventorySlot", {
            start: new Vec2(232, 24),
            slotLayer: "slots",
            padding: 8,
            itemLayer: "items"
        });

        // Give the player physics
        this.player.addPhysics(new AABB(Vec2.ZERO, new Vec2(8, 8)));

        // Give the player a healthbar
        this.playerHealthbar = new HealthbarHUD(this, this.player, "primary", {size: this.player.size.clone().scaled(2, 1/2), offset: this.player.size.clone().scaled(0, -1/2)});

        // Give the player PlayerAI
        this.player.addAI(PlayerAI);

        // Start the player in the "IDLE" animation
        this.player.animation.play("IDLE");

        this.battlers.push(this.player);
        this.viewport.follow(this.player);
    }
    /**
     * Initialize the NPCs 
     */
    protected initializeNPCs(): void {
        this.guards= this.add.animatedSprite(NPCActor, "player1", "primary");
        this.guards.position.set(100, 100);

    }
    protected enterChase(): void {

        if (this.guards.position.distanceTo(this.player.position) < 50) {
            this.seenFlag = true;
            if (this.guards.position.x > this.player.position.x) {
                this.guards.position.x -= .2;
            }else{
                this.guards.position.x += .2;
            }
            if (this.guards.position.y > this.player.position.y) {
                this.guards.position.y -= .2;
            }else{
                this.guards.position.y += .2;
            }
        }else{
            this.seenFlag = false;
        }

    
}
    /**
     * Initialize the items in the scene
     */
    protected initializeItems(): void {
        let healthpacks = this.load.getObject("healthpacks");
        this.healthpacks = new Array<Healthpack>(healthpacks.items.length);
        for (let i = 0; i < healthpacks.items.length; i++) {
            let sprite = this.add.sprite("healthpack", "primary");
            this.healthpacks[i] = new Healthpack(sprite);
            this.healthpacks[i].position.set(healthpacks.items[i][0], healthpacks.items[i][1]);
            this.healthpacks[i].updateBoundary();
        }
    
        let keys = this.load.getObject("keys");
        this.keys = new Array<Key>(keys.items.length);
        for (let i = 0; i < keys.items.length; i++) {
            let sprite = this.add.sprite("key", "primary");
            this.keys[i] = new Key(sprite);
            this.keys[i].position.set(keys.items[i][0], keys.items[i][1]);
            this.keys[i].updateBoundary();
        }

        let vents = this.load.getObject("vents");
        this.vents = new Array<Vent>(vents.items.length);
        for (let i = 0; i < vents.items.length; i++) {
            let sprite = this.add.sprite("vent", "primary");
            this.vents[i] = new Vent(sprite);
            this.vents[i].position.set(vents.items[i][0], vents.items[i][1]);
            this.vents[i].updateBoundary();
        }

        let safes = this.load.getObject("safes");
        this.safes = new Array<Safe>(safes.items.length);
        for (let i = 0; i < safes.items.length; i++) {
            let sprite = this.add.sprite("safe", "primary");
            this.safes[i] = new Safe(sprite);
            this.safes[i].position.set(safes.items[i][0], safes.items[i][1]);
            this.safes[i].updateBoundary();
        }

        let obstacles = this.load.getObject("obstacles");
        this.obstacles = new Array<Obstacle>(obstacles.items.length);
        for (let i = 0; i < obstacles.items.length; i++) {
            let sprite = this.add.sprite("obstacle", "primary");
            this.obstacles[i] = new Obstacle(sprite);
            this.obstacles[i].position.set(obstacles.items[i][0], obstacles.items[i][1]);
            this.obstacles[i].updateBoundary();
        }

        let lockers = this.load.getObject("lockers");
        this.lockers = new Array<Locker>(lockers.items.length);
        for (let i = 0; i < lockers.items.length; i++) {
            let sprite = this.add.sprite("locker", "primary");
            this.lockers[i] = new Locker(sprite);
            this.lockers[i].position.set(lockers.items[i][0], lockers.items[i][1]);
            this.lockers[i].updateBoundary();
        }

        let electricities = this.load.getObject("electricities");
        this.electricities = new Array<Electricity>(electricities.items.length);
        for (let i = 0; i < electricities.items.length; i++) {
            let sprite = this.add.sprite("electricity", "primary");
            this.electricities[i] = new Electricity(sprite);
            this.electricities[i].position.set(electricities.items[i][0], electricities.items[i][1]);
            this.electricities[i].updateBoundary();
        }

        let switches = this.load.getObject("switches");
        this.switches = new Array<Switch>(switches.items.length);
        for (let i = 0; i < switches.items.length; i++) {
            let sprite = this.add.sprite("switch", "primary");
            this.switches[i] = new Switch(sprite);
            this.switches[i].position.set(switches.items[i][0], switches.items[i][1]);
            this.switches[i].updateBoundary();
        }

        let offs = this.load.getObject("offs");
        this.offs = new Array<Off>(offs.items.length);
        for (let i = 0; i < offs.items.length; i++) {
            let sprite = this.add.sprite("off", "primary");
            this.offs[i] = new Off(sprite);
            this.offs[i].position.set(offs.items[i][0], offs.items[i][1]);
            this.offs[i].updateBoundary();
        }

    }

    initializeUI(): void {

        this.addUILayer("money");

        this.moneyLabel = <Label>this.add.uiElement(UIElementType.LABEL, "money", {position: new Vec2(75, 25), text: `$: ${this.money}`});
        this.moneyLabel.size.set(200, 50);
        this.moneyLabel.setHAlign("left");
        this.moneyLabel.textColor = Color.WHITE;
    }


    /**
     * Initializes the navmesh graph used by the NPCs in the HW4Scene. This method is a little buggy, and
     * and it skips over some of the positions on the tilemap. If you can fix my navmesh generation algorithm,
     * go for it.
     * 
     * - Peter
     */
    protected initializeNavmesh(): void {
        // Create the graph
        this.graph = new PositionGraph();

        let dim: Vec2 = this.walls.getDimensions();
        for (let i = 0; i < dim.y; i++) {
            for (let j = 0; j < dim.x; j++) {
                let tile: AABB = this.walls.getTileCollider(j, i);
                this.graph.addPositionedNode(tile.center);
            }
        }

        let rc: Vec2;
        for (let i = 0; i < this.graph.numVertices; i++) {
            rc = this.walls.getTileColRow(i);
            if (!this.walls.isTileCollidable(rc.x, rc.y) &&
                !this.walls.isTileCollidable(MathUtils.clamp(rc.x - 1, 0, dim.x - 1), rc.y) &&
                !this.walls.isTileCollidable(MathUtils.clamp(rc.x + 1, 0, dim.x - 1), rc.y) &&
                !this.walls.isTileCollidable(rc.x, MathUtils.clamp(rc.y - 1, 0, dim.y - 1)) &&
                !this.walls.isTileCollidable(rc.x, MathUtils.clamp(rc.y + 1, 0, dim.y - 1)) &&
                !this.walls.isTileCollidable(MathUtils.clamp(rc.x + 1, 0, dim.x - 1), MathUtils.clamp(rc.y + 1, 0, dim.y - 1)) &&
                !this.walls.isTileCollidable(MathUtils.clamp(rc.x - 1, 0, dim.x - 1), MathUtils.clamp(rc.y + 1, 0, dim.y - 1)) &&
                !this.walls.isTileCollidable(MathUtils.clamp(rc.x + 1, 0, dim.x - 1), MathUtils.clamp(rc.y - 1, 0, dim.y - 1)) &&
                !this.walls.isTileCollidable(MathUtils.clamp(rc.x - 1, 0, dim.x - 1), MathUtils.clamp(rc.y - 1, 0, dim.y - 1))

            ) {
                // Create edge to the left
                rc = this.walls.getTileColRow(i + 1);
                if ((i + 1) % dim.x !== 0 && !this.walls.isTileCollidable(rc.x, rc.y)) {
                    this.graph.addEdge(i, i + 1);
                    // this.add.graphic(GraphicType.LINE, "graph", {start: this.graph.getNodePosition(i), end: this.graph.getNodePosition(i + 1)})
                }
                // Create edge below
                rc = this.walls.getTileColRow(i + dim.x);
                if (i + dim.x < this.graph.numVertices && !this.walls.isTileCollidable(rc.x, rc.y)) {
                    this.graph.addEdge(i, i + dim.x);
                    // this.add.graphic(GraphicType.LINE, "graph", {start: this.graph.getNodePosition(i), end: this.graph.getNodePosition(i + dim.x)})
                }


            }
        }

        // Set this graph as a navigable entity
        let navmesh = new Navmesh(this.graph);
        
        // Add different strategies to use for this navmesh
        navmesh.registerStrategy("direct", new DirectStrategy(navmesh));
        navmesh.registerStrategy("astar", new AstarStrategy(navmesh));

        // TODO set the strategy to use A* pathfinding
        navmesh.setStrategy("astar");

        // Add this navmesh to the navigation manager
        this.navManager.addNavigableEntity("navmesh", navmesh);
    }

    public getPlayer(): Battler { return this.player; }

    public getWalls(): OrthogonalTilemap { return this.walls; }

    public getHealthpacks(): Healthpack[] { return this.healthpacks; }

    public getLaserGuns(): LaserGun[] { return this.laserguns; }

    public getKeys(): Key[] { return this.keys; }

    public getVents(): Vent[] { return this.vents; }

    public getSafes(): Safe[] { return this.safes; }

    public getObstacles(): Obstacle[] { return this.obstacles };

    public getLockers(): Locker[] { return this.lockers };

    public getElectricities(): Electricity[] { return this.electricities };

    public getOffs(): Off[] { return this.offs };

    /**
     * Checks if the given target position is visible from the given position.
     * @param position 
     * @param target 
     * @returns 
     */
    public isTargetVisible(position: Vec2, target: Vec2): boolean {

        // Get the new player location
        let start = position.clone();
        let delta = target.clone().sub(start);

        // Iterate through the tilemap region until we find a collision
        let minX = Math.min(start.x, target.x);
        let maxX = Math.max(start.x, target.x);
        let minY = Math.min(start.y, target.y);
        let maxY = Math.max(start.y, target.y);

        // Get the wall tilemap
        let walls = this.getWalls();

        let minIndex = walls.getTilemapPosition(minX, minY);
        let maxIndex = walls.getTilemapPosition(maxX, maxY);

        let tileSize = walls.getScaledTileSize();

        for (let col = minIndex.x; col <= maxIndex.x; col++) {
            for (let row = minIndex.y; row <= maxIndex.y; row++) {
                if (walls.isTileCollidable(col, row)) {
                    // Get the position of this tile
                    let tilePos = new Vec2(col * tileSize.x + tileSize.x / 2, row * tileSize.y + tileSize.y / 2);

                    // Create a collider for this tile
                    let collider = new AABB(tilePos, tileSize.scaled(1 / 2));

                    let hit = collider.intersectSegment(start, delta, Vec2.ZERO);

                    if (hit !== null && start.distanceSqTo(hit.pos) < start.distanceSqTo(target)) {
                        // We hit a wall, we can't see the player
                        return false;
                    }
                }
            }
        }
        return true;

    }

    handleCollisions() {
        for (let key of this.keys) {
            if (key.visible && this.player.collisionShape.overlaps(key.boundary)) {
                key.visible = false;
                this.player.inventory.add(key);
            }
        }

        for (let vent of this.vents) {
            if (vent.visible && this.player.collisionShape.overlaps(vent.boundary)) {
                let random = Math.floor(Math.random() * this.vents.length);
                let newPlayerPos: Vec2 = new Vec2(this.vents[random].position.x + 35, this.vents[random].position.y);
                this.player.position = newPlayerPos;
            }
        }

        for (let safe of this.safes) {
            if (safe.visible && this.player.collisionShape.overlaps(safe.boundary) && safe.unlooted) {
                for (let item of this.player.inventory.inventory.values()) {
                    if (item instanceof Key) {
                        this.money += 100;
                        this.moneyLabel.text = `$: ${this.money}`;
                        let key = item.id;
                        this.player.inventory.remove(key);
                    }
                }
            }
        }

        for (let obstacle of this.obstacles) {
            if (obstacle.visible && this.player.collisionShape.overlaps(obstacle.boundary)) {
                this.player.health -= .1;
            }
        }

        for (let healthpack of this.healthpacks) {
            if (healthpack.visible && this.player.collisionShape.overlaps(healthpack.boundary)) {
                healthpack.visible = false;
                if (this.player.health + healthpack.health > this.player.maxHealth) {
                    this.player.health = this.player.maxHealth;
                }
                else {
                    this.player.health += healthpack.health;
                }
            }
        }

        for (let electricity of this.electricities) {
            if (electricity.visible && this.player.collisionShape.overlaps(electricity.boundary)) {
                this.player.health = 0;
            }
        }

        for (let off of this.offs) {
            if (off.visible && this.player.collisionShape.overlaps(off.boundary)) {
                for (let electricity of this.electricities) {
                    electricity.visible = false;
                }
                off.visible = false;
            }
        }

    }
}