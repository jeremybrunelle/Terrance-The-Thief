import Stack from "../../Wolfie2D/DataTypes/Collections/Stack";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import NavigationPath from "../../Wolfie2D/Pathfinding/NavigationPath";
import NavPathStrat from "../../Wolfie2D/Pathfinding/Strategies/NavigationStrategy";
import GraphUtils from "../../Wolfie2D/Utils/GraphUtils";
import List from "../../Wolfie2D/DataTypes/Collections/List"
import AstarPriorityQueue from "./AstarPriorityQueue";

// TODO Construct a NavigationPath object using A*

/**
 * The AstarStrategy class is an extension of the abstract NavPathStrategy class. For our navigation system, you can
 * now specify and define your own pathfinding strategy. Originally, the two options were to use Djikstras or a
 * direct (point A -> point B) strategy. The only way to change how the pathfinding was done was by hard-coding things
 * into the classes associated with the navigation system. 
 * 
 * - Peter
 */
export default class AstarStrategy extends NavPathStrat {

    /**
     * @see NavPathStrat.buildPath()
     */
    public buildPath(to: Vec2, from: Vec2): NavigationPath {

        // Get the closest nodes in the graph to our to and from positions
        let start: number = this.mesh.graph.snap(from);
        let end: number = this.mesh.graph.snap(to);

        // Initialize open and closed lists
        let open: AstarPriorityQueue = new AstarPriorityQueue();
        let openMap = new Set<number>();
        //let closed: {index: number, g_distance: number, h_distance: number, f_distance: number}[] = [];
        let closed = new Set<number>();

        // Add the start node to open
        open.enqueue(start, 0, this.heuristic(start, end));
        openMap.add(start);

        // Loop until condition is met
        for (;;) {
            // There is no path
            if (open.isEmpty()) {
                break;
            }

            // Find the node with the lowest f_distance and remove it from open and add it to closed
            let current: {index: number, g_distance: number, h_distance: number, f_distance: number, parent} = open.dequeue();
            let currentIndex: number = current.index;
            closed.add(current.index);

            // Path has been found
            if (currentIndex == end) {
                let pathStack = new Stack<Vec2>(this.mesh.graph.numVertices);
                let curr = current;
                while (curr.parent) {
                    pathStack.push(this.mesh.graph.getNodePosition(curr.index));
                    curr = curr.parent;
                }
                return new NavigationPath(pathStack);
            }

            // Check the neighbors of current
            let neighbors: number[] = this.neighbors(currentIndex);
            for (let index of neighbors) {
    
                // Check if neighbor already in closed
                if (closed.has(index)) {
                    continue;
                }

                // Setup the neighbor object
                let neighborPos: Vec2 = this.mesh.graph.getNodePosition(index);
                let currentPos: Vec2 = this.mesh.graph.getNodePosition(currentIndex);
                let g: number = current.g_distance + Math.sqrt((neighborPos.x-currentPos.x)**2 + (neighborPos.y-currentPos.y)**2);
                let h: number = this.heuristic(index, end);
                let f: number = g + h;
                let neighbor = {index, g, h, f, parent: null};
                // If this is the first time this node has been seen, it must be the best
                /*let boolAndItem = open.containsIndexAndGFromIndex(index);
                if (boolAndItem[1] === 0) {
                    open.enqueue(index, g, h, current);
                }
                else if (boolAndItem[0] > g) {
                    open.modifyFromIndex(index, g, h, current);
                }*/
                
                if (!openMap.has(index)) {
                    open.enqueue(index, g, h, current);
                    openMap.add(index);
                }
                // If this node has already been seen, but now has a better g
                /*else if (open.gFromIndex(index) > g) {
                    open.modifyFromIndex(index, g, h, current);
                }*/
                else {
                    open.modifyFromIndex(index, g, h, current);
                }



            }
           
            


            
        }
        return new NavigationPath(new Stack<Vec2>());
        

        

        // Push the final position and the final position in the graph
		//pathStack.push(to.clone());
		//pathStack.push(this.mesh.graph.positions[end]);


        //return new NavigationPath(pathStack);
    }

    private getNeighbors(node: number): number[] {

        let neighbors: number[] = [];
        
        for (let i = 0; i < this.mesh.graph.numVertices; i++) {
            if (this.mesh.graph.edgeExists(node, i)) {
                neighbors.push(i);
            }
            if (neighbors.length > 3) {
                break;
            }
        }
        return neighbors;
    }

    private neighbors(node: number): number[] {
        let neighbors: number[] = [];
        if (this.mesh.graph.edgeExists(node, node - 64)) {
            neighbors.push(node-64);
        }
        if (this.mesh.graph.edgeExists(node, node - 1)) {
            neighbors.push(node-1);
        }
        if (this.mesh.graph.edgeExists(node, node + 1)) {
            neighbors.push(node+1);
        }
        if (this.mesh.graph.edgeExists(node, node + 64)) {
            neighbors.push(node+64);
        }
        return neighbors;
    }

    private heuristic(node: number, end: number): number {
        let startPos = this.mesh.graph.getNodePosition(node);
        let endPos = this.mesh.graph.getNodePosition(end);
        let manhattanDistance = Math.abs(startPos.x - endPos.x) + Math.abs(startPos.y - endPos.y);
        return manhattanDistance;
    }
    
}