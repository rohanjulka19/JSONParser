Grammar - 

S -> {A} | {}
A -> C:BE
B -> C|{A}|[BF]
C -> "v" | v
F -> ,B | @
E -> ,A | @

Tokens - '[' ',' ']' '{' '}' '"' ':' char int

'{"a":"b"}'

Dictionary -> {KeyValue} | {}
json -> {A
A -> KeyValue} | }
KeyValue -> Key:ValueNextExpr 
Key -> "char" | int
Value -> Const | {Const:ValueNextKeyValue} | [ValueNextValue]
NextValue -> ,Value | e
NextKeyValue -> ,NextKeyValue | e



KeyValue -> {}