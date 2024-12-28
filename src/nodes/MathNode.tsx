// import Node from "./Node";
// import SelectParameter from "./parameters/SelectParameter";
// import Input from "./sockets/Input";
// import Output from "./sockets/Output";



// export default class MathNode extends Node
// {
//     constructor(id: string)
//     {
//         super(
//             id,
//             'math',
//             [
//                 new Input('a', 'data', 'number'),
//                 new Input('b', 'data', 'number')
//             ],
//             [
//                 new Output('out', 'data', 'number')
//             ],
//             [
//                 new SelectParameter('operation', '+', 
//                 [
//                     { name: 'exp', value: 'a ^ b' },
//                     { name: 'mul', value: 'a * b' }, 
//                     { name: 'add', value: 'a + b' }, 
//                     { name: 'sub', value: 'a - b' }, 
//                     { name: 'div', value: 'a / b' }, 
//                     { name: 'mod', value: 'a % b' } 
//                 ])
//             ]
//         )
//     }

    

//     eval(): Number
//     {
//         const a = 1;//this.inputs[0].eval();
//         const b = 2;//this.inputs[1].eval();

//         const op = this.parameters.find(p => p.name == 'operation')?.value;

//         switch (op)
//         {
//             case 'exp': return a ** b;
//             case 'mul': return a * b;
//             case 'add': return a + b;
//             case 'sub': return a - b;
//             case 'div': return a / b;
//             case 'mod': return a % b;
//         }

//         throw new Error('Unknown operation');
//     }
// }