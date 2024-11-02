'use client'

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ReactElement, ReactNode, useState } from "react";

export default function Home() {
  // "8, 3, 1, 10, 6, 14, 4, 7, 13"

  const [nodes, setNodes] = useState<Array<number>>([]) 
  const [isValidBST, setIsValidBST] = useState<boolean>()
  const startNodeCoordinates = [300,100]
  // Checks if input text is a valid BST
  function treeValidator(nodes:string):boolean {
    return true
  }

  interface IBSTNode {
    root: number, 
    left: IBSTNode | null, 
    right: IBSTNode |  null
  }

  class BSTNode implements IBSTNode{
    root: number;
    left: IBSTNode | null;
    right: IBSTNode| null;

    constructor(root: number, left: IBSTNode | null , right: IBSTNode | null) {
      this.root = root;
      if(typeof(left) == "number" && left > root){
        throw new Error('left cannot be more than root') 
      }
      this.left = left

      if(typeof(right) == "number" && right < root){
        throw new Error('right cannot be more than root') 
      }
      this.right = right
    }
  }

  function BSTbuilder(nodes: Array<number>): null | BSTNode {
    if(nodes.length == 0) {
      return null
    } 
    const root = nodes[0]
    
    const subNodesLeft = []
    for (let index = 0; index < nodes.length; index++) {
      const element = nodes[index];
      if(element < root){
        subNodesLeft.push(element)
      }
    }
    const subNodesRight = []
    for (let index = 0; index < nodes.length; index++) {
      const element = nodes[index];
      if(element > root){
        subNodesRight.push(element)
      }
    }

    return new BSTNode(root, BSTbuilder(subNodesLeft), BSTbuilder(subNodesRight))
  }

  const treeNodes = BSTbuilder(nodes)


  function graphBuilder(parentNodeCoordinates: Array<number>, nodes:Array<number>, treeNodes: BSTNode | null): ReactNode {

    if(treeNodes == null || Number.isNaN(treeNodes.root)){
      return (
        <div>No nodes</div>
      )
    }
    let scalerX = 100 
    let scalerY = 150

    const rootX = parentNodeCoordinates[0]
    const rootY = parentNodeCoordinates[1]
    const leftNode: number | null = treeNodes.left?.root == null ? null : treeNodes.left?.root
    const rightNode: number | null = treeNodes.right?.root == null ? null : treeNodes.right?.root
    
    return (
      <svg className="w-full h-full " viewBox="0 0 600 1080" xmlns="http://www.w3.org/2000/svg">
        <g>
          <circle fill="none" stroke="#161616" strokeWidth="3" cx={rootX} cy={rootY} r="50" />
          <text x={rootX} y={rootY} fontSize="30" textAnchor="middle" dy="0.35em">{treeNodes.root.toString()}</text>
        </g>
        
        {leftNode && <g>
          <path d={drawConnection([rootX,rootY], [rootX - scalerX,rootY + scalerY])} stroke="black" strokeWidth="3" fill="none" />
          <circle fill="none" stroke="#161616" strokeWidth="3" cx={rootX - scalerX} cy={rootY + scalerY} r="50" /> 
          <text x={rootX - scalerX} y={rootY + scalerY} fontSize="30" textAnchor="middle" dy="0.35em">{leftNode}</text>
          {graphBuilder([rootX - scalerX, rootY + scalerY], nodes, treeNodes.left)}
        </g>}

        {rightNode && <g>
            <path d={drawConnection([rootX,rootY], [rootX + scalerX,rootY + scalerY])} stroke="black" strokeWidth="3" fill="none" />
            <circle fill="none" stroke="#161616" strokeWidth="3" cx={rootX + scalerX} cy={rootY + scalerY} r="50" /> 
            <text x={rootX + scalerX} y={rootY + scalerY} fontSize="30" textAnchor="middle" dy="0.35em">{rightNode}</text>
            {graphBuilder([rootX + scalerX, rootY + scalerY], nodes, treeNodes.right)}
          </g>
        }
      
      </svg>
    )
  }

  function drawConnection(parentNodeCoordinates:Array<number>, childNodeCoordinates:Array<number>): string {
    length = Math.sqrt((parentNodeCoordinates[0] - childNodeCoordinates[0])**2 + (parentNodeCoordinates[1] - childNodeCoordinates[1])**2)
    // Find vector between two points
    const directionalVector = [(childNodeCoordinates[0] - parentNodeCoordinates[0]), (childNodeCoordinates[1] - parentNodeCoordinates[1])]
    // Normalise vector
    const unitVector = [directionalVector[0]/length, directionalVector[1]/length]
    // clip 50 units from start and end
    const connectionVector = [[parentNodeCoordinates[0] + 50 * unitVector[0],  parentNodeCoordinates[1] + 50 * unitVector[1]], [childNodeCoordinates[0] - 50 * unitVector[0],  childNodeCoordinates[1] - 50 * unitVector[1]]]
    
    return `M ${connectionVector[0][0]} ${connectionVector[0][1]} L ${connectionVector[1][0]} ${connectionVector[1][1]}`
  }

  return (
    <div className="px-10 flex flex-col py-2 gap-2">
      <h1 className="place-self-center text-lg font-bold">Node Graph Visualiser</h1>
      <Input className={`${isValidBST == false ? 'border-red-500' : null }`} onChange={e => setNodes(e.target.value.split(',').map(e => parseInt(e,10)))} placeholder="Enter your graph"></Input>
      <div className="flex gap-2 w-full">
        <Button className="flex-1"> Generate </Button>
        <Button className="flex-1" variant="secondary"> Randomise </Button>
      </div>
      <div>
          <div className="w-full">
            { graphBuilder([300,100], nodes, treeNodes) }
          </div>
      </div>
    </div>
  );
}
