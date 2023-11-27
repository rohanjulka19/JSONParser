
const StreamReader = (data) =>  {
    let currentIdx = -1
    const peek = (i=1)=> {
        return data[currentIdx + i]
    }

    const next = () => {
        currentIdx += 1
        return data[currentIdx]
    }

    const eof = () => {
        return currentIdx >= data.length - 1
    }

    return {
        peek,
        next,
        eof
    }
}
const Tokens = {
    QOUTES: '"',
    COMMA: ',',
    BRACKET_OPEN: '[',
    BRACKET_CLOSE: ']',
    PAREN_OPEN: '{',
    PAREN_CLOSE: '}',
    COLON: ':'
}


const Tokenizer = (streamReader) => {
    var current = streamReader.next()

    const next = () => {
        var temp = current
        current = nextToken()
        return temp
    }

    const nextToken = () => {
        if(streamReader.eof())
            return
        var curChar = " "
        while(curChar  == " ")  {
            curChar = streamReader.next();
        }
        var token = matchToken(curChar) 
        if(token == "") {
            token = getConstant(curChar)
        }
        return token
    }
    
    const peek = () => {
        return current
    }

    const matchToken = (curChar) => {
        var token = ""
        Object.keys(Tokens).forEach((key) => {
            if(curChar === Tokens[key]) {
                token = curChar
            }
        })
        return token
    }

    const getConstant = (curChar) => {
        var str = curChar
        var nextChar = streamReader.peek()
        while (matchToken(nextChar) == "" && nextChar != " ") {
            curChar = streamReader.next()
            str += curChar
            nextChar = streamReader.peek()
        }
        return str
    }

    return {
        next,
        peek
    }
} 


const JSONParser = () => { 
    var tokenizer ;
    const ParseTreeNode = () => {
        return {
            child: [],
            value: "",
            isTerminal: false,
            parent: ""
        }
    }


    const parseJson = (text) => {
        tokenizer = Tokenizer(StreamReader(text))
        var rootNode = ParseTreeNode()
        rootNode = parseKeyValue()
        return rootNode
    }

    const parseDictionary = () => {
        var treeNode = ParseTreeNode()
        var token = tokenizer.next()
        if (token == Tokens.PAREN_OPEN) {
            treeNode.child.push(Tokens.PAREN_OPEN)
        } else {
            console.log('Error expected this %d got this %d', Tokens.PAREN_OPEN, token)
        }
        treeNode.child.push(parseKeyValue())
        
    }

    const parseKeyValue = () => {
        var treeNode = ParseTreeNode()
        var token = tokenizer.next()
        if (token == Tokens.PAREN_OPEN) {
            treeNode.child.push(Tokens.PAREN_OPEN)
        } else {
            console.log('Error expected this %d got this %d', Tokens.PAREN_OPEN, token)
        }

        treeNode.child.push(parseKey())

        token = tokenizer.next()
        if (token == Tokens.COLON) {
            treeNode.child.push(Tokens.COLON)
        } else {
            console.log('Error expected this %d got this %d', Tokens.COLON, token)
        }

        treeNode.child.push(parseValue())

        if (token == Tokens.PAREN_CLOSE) {
            treeNode.child.push(Tokens.PAREN_CLOSE)
        } else {
            console.log('Error expected this %d got this %d', Tokens.PAREN_CLOSE, token)
        }

        return treeNode
    }

    const parseKey = () => {
        var treeNode = ParseTreeNode()
        var token = tokenizer.next()
        if(token == Tokens.QOUTES) {
            treeNode.child.push(Tokens.QOUTES)
            treeNode.child.push(tokenizer.next())
            token = tokenizer.next()
            if(token == Tokens.QOUTES) {
                treeNode.child.push(Tokens.QOUTES)
            } else {
                console.log('Error expected this %d got %d', Tokens.QOUTES, token)
            }
        } else {
            if(/[a-z | A-Z]/.test(token)) {
                console.log("Error Unexpected token '%d'", token)
            }
            treeNode.child.push(parseInt(token))
        }

        return treeNode
    }

    const parseValue = () => {
        var treeNode = ParseTreeNode()
        var token = tokenizer.peek()
        switch(token) {
            case Tokens.PAREN_OPEN: 
                treeNode.child.push(parseKeyValue())
                break;
            case Tokens.BRACKET_OPEN:
                tokenizer.next()
                treeNode.child.push(Tokens.BRACKET_OPEN);
                treeNode.child.push(parseValue());
                var childNode = parseNextValue()
                if(childNode) {
                    treeNode.child.push(childNode)
                }
                token = tokenizer.next()
                if(token == Tokens.BRACKET_CLOSE) {
                    treeNode.child.push(Tokens.BRACKET_CLOSE)
                } else {
                    console.log('Error expected this %d got %d', Tokens.BRACKET_CLOSE, token)
                }
                break;
            default: 
                treeNode.child.push(parseKey())
                break;
        }
    }

    const parseNextValue = () => {
        var token = tokenizer.peek()
        if(token == Tokens.COMMA) {
            var treeNode = ParseTreeNode()
            treeNode.child.push(Tokens.COMMA)
            treeNode.child.push(parseValue())
            return treeNode
        }
        return
    }

    const parseNextKeyValue = () => {

    }
}

let s = StreamReader('{"abcd":["b"]}')
let t = Tokenizer(s)

console.log(t.next())
console.log(t.next())
console.log(t.next())

console.log(t.next())
console.log(t.next())
console.log(t.next())


console.log(t.next())
console.log(t.next())
console.log(t.next())


console.log(t.next())
console.log(t.next())
console.log(t.next())
