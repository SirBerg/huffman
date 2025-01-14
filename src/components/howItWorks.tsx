'use client'
import './howItWorks.css'
import {useEffect, useState, Dispatch, SetStateAction} from 'react';
import {encode, treeNode, treeToBinary} from "@/huffman/encode";
import { Tree2 } from './Tree/huffmanTree';

function Tree({node, hasParentElement}:{node:treeNode, hasParentElement?:boolean}){
    let charToDisplay = node.char.length != 1 ? node.priority : node.char

    if(charToDisplay == " "){
        charToDisplay = "space"
    }
    if(!hasParentElement){
        return (
            <ul key={node.char}>
                <li>
                    <a>{charToDisplay}</a>
                    <ul>
                        {node.children.map((child) => <Tree node={child} key={child.char} hasParentElement={true}/>)}
                    </ul>
                </li>
            </ul>
        )
    }
    else{
        return (
            <li>
                <a>{charToDisplay}</a>
                {
                    node.children.length == 0 ? null : <ul>
                        {node.children.map((child) => <Tree node={child} key={child.char} hasParentElement={true}/>)}
                    </ul>
                }
            </li>
        )
    }
}

function Character({charBinary, char, treeNode, color}:{charBinary:string, char:string, treeNode:treeNode, color:string}){
    //get the correct treeNode out of the tree provided
    charBinary.split('').forEach((bit)=>{
        if(bit == '0' && treeNode.children[0]){
            treeNode = treeNode.children[0]
        }else if(bit == '1' && treeNode.children[1]){
            treeNode = treeNode.children[1]
        }
    })

    return (
        <div className="characterContainer" style={{color:`#${color}`}}>
            <div className="character">{charBinary}</div>
            <div className="details">
                <p>Char: {char == " " ? "space" : char}</p>
                <p>Priorität: {treeNode.priority}</p>
            </div>
        </div>
    )
}

export default function HowItWorks(){
    const [treeData, setTreeData]:[treeNode, Dispatch<SetStateAction<treeNode>>] = useState(encode('hello world'))
    const [inputString, setInputString]:[string, Dispatch<SetStateAction<string>>] = useState('hello world')
    const [treeBinaryData, setTreeBinaryData]:[{[key:string]:string}, Dispatch<SetStateAction<{[key:string]:string}>>] = useState(treeToBinary(treeData))
    const [randomColor, setRandomColor]:[{[key:string]:string}, Dispatch<SetStateAction<{[key:string]:string}>>] = useState({})
    useEffect(()=>{
        const encodedStuff:treeNode = encode(inputString)
        setTreeData(encodedStuff)
        const binary:{[key:string]:string} = treeToBinary(encodedStuff)
        setTreeBinaryData(binary)
        const chars = Object.keys(binary)
        const colors:{[key:string]:string} = {}
        chars.map((char)=>{
            colors[char] = Math.floor(Math.random()*16777215).toString(16)
        })
        setRandomColor(colors)
    }, [inputString])

    return (
        <div className="howItWorksContainer">
            <h1>Try it</h1>
            <input type="text" className="exampleInputField"
               onChange={(e) => {
                   if(e.target.value){
                       setInputString(e.target.value)
                   }
                   else{
                       setInputString(" ")
                   }
               }}
               value={inputString}
            />
            <div className="treeContainer">
                <div className="tree2">
                    <Tree2 node={treeData} colors={randomColor}/>
                </div>
            </div>
            <div className="DecodedCharacters">
                {
                    Object.keys(treeBinaryData).map((char, index)=> {
                        return <Character
                            charBinary={treeBinaryData[char]}
                            char={char}
                            treeNode={treeData}
                            color={randomColor[char]}
                            key={index}
                        />
                    })
                }
            </div>
            <div>
                Für eine bessere Visualisierung gibt es hier <a href="https://cmps-people.ok.ubc.ca/ylucet/DS/Huffman.html" target="_blank" style={{color:'purple'}}>eine Website</a>
            </div>
        </div>
    )
}