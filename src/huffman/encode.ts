
export type treeNode = {
    priority: number,
    char: string,
    children: treeNode[]
}

//sort the frequency of the characters from lowest to highest
function sortFreq(freq:{[key:string]:number}):{[key:string]:number}{
    const keys = Object.keys(freq)
    const sortedFreq:{[key:string]:number} = {}
    keys.sort((a,b) => freq[a] - freq[b])
    keys.forEach((key) => {
        sortedFreq[key] = freq[key]
    })
    return sortedFreq
}

//build tree
function buildTree(freq:{[key:string]:number}):treeNode{
    let nodes:treeNode[] = []
    for(const key in freq){
        nodes.push({priority: freq[key], char: key, children: []})
    }
    while(nodes.length > 1){
        nodes = nodes.sort((a,b) => a.priority - b.priority)
        const left = nodes.shift()
        const right = nodes.shift()
        // @ts-expect-error it does exist
        const newNode:treeNode = {priority: left.priority + right.priority, char: left.char + right.char, children: [left, right]}
        nodes.push(newNode)
    }
    return nodes[0]
}

export function encode(input:string):treeNode{
    //find out the frequency of each character and sort them
    let freq:{[key:string]:number} = {}
    for(let i = 0; i < input.length; i++){
        if(freq[input[i]]){
            freq[input[i]]++
        }else{
            freq[input[i]] = 1
        }
    }

    //sort the frequency
    freq = sortFreq(freq)


    return buildTree(freq);
}

export function treeToBinary(tree:treeNode):{[key:string]:string}{
    const binary:{[key:string]:string} = {}
    function traverse(node:treeNode, path:string){
        if(node.children.length == 0){
            binary[node.char] = path
        }else{
            traverse(node.children[0], path + '0')
            traverse(node.children[1], path + '1')
        }
    }
    traverse(tree, '')
    return binary
}