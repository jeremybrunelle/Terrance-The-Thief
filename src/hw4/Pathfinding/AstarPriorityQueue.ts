export default class AstarPriorityQueue {

    private elements: {index: number, g_distance: number, h_distance: number, f_distance: number, parent}[];

    constructor() {
        this.elements = [];
    }

    isEmpty(): boolean {
        return this.elements.length == 0;
    }

    enqueue(index: number, g_distance: number, h_distance: number, parent = null): void {
        let f_distance = g_distance + h_distance;
        let insertionIndex = 0;
        let node = {index, g_distance, h_distance, f_distance, parent};
        while (insertionIndex < this.elements.length && f_distance >= this.elements[insertionIndex].f_distance) {
            insertionIndex++;
        }
        this.elements.splice(insertionIndex, 0, node);
        //this.elements.push({index, g_distance, h_distance, f_distance, parent});
        //this.elements.sort((a, b) => a.f_distance - b.f_distance);
    }

    dequeue(): {index: number, g_distance: number, h_distance: number, f_distance: number, parent} {
        return this.elements.shift();
    }

    containsIndex(index: number): boolean {
        for (let item of this.elements) {
            if (item.index == index) {
                return true;
            }
            return false;
        }
    }

    gFromIndex(index: number): number {
        for (let item of this.elements) {
            if (item.index == index) {
                return item.g_distance;
            }
        }
    }

    modifyFromIndex(index: number, g: number, h: number, parent): void {
        for (let item of this.elements) {
            if (item.index == index) {
                if (item.g_distance > g) {
                item.g_distance = g;
                item.h_distance = h;
                item.f_distance = g + h;
                item.parent = parent;
                }
                break;
            }
        }
    }                                

    containsIndexAndGFromIndex(index: number): Array<number> {
        let arr = [];
        for (let item of this.elements) {
            if (item.index == index) {
                arr.push(1);
                arr.push(item.index);
                break;
            }
        }
        if (arr.length == 0) {
            arr.push(0);
            arr.push(-1);
        }
        return arr;
    }
    
}