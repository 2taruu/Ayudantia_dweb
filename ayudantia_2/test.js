// ------------------------------
// VARIABLES
// ------------------------------

//En JavaScript, var es la forma antigua de declarar variables y su alcance es 
// global o de función, lo que puede generar errores, por eso hoy no se recomienda;
// let permite declarar variables que sí pueden cambiar su valor y tienen alcance 
// de bloque, es decir, solo existen dentro de las llaves donde fueron definidas; 
// mientras que const se utiliza para declarar constantes que no pueden reasignarse
//  y también tienen alcance de bloque; en la práctica se recomienda usar siempre 
// const por defecto y cambiar a let solo cuando la variable deba modificarse.

var x = 10;   // Declaración con var (alcance global o de función)
let y = 5;    // Declaración con let (alcance de bloque)
const z = 30; // Declaración con const (no puede cambiar)

x = 7;        // Reasignar con var -> permitido
y = 20;       // Reasignar con let -> permitido
// z = 40;    // ❌ Error, no se puede reasignar una constante

console.log("x =", x); // 7
console.log("y =", y); // 20
console.log("z =", z); // 30



// ------------------------------
// TIPOS DE DATOS
// ------------------------------
let nombre = "Juan";       // string
let edad = 25;             // number
let esAdulto = true;       // boolean
let indefinido;            // undefined (sin valor asignado)
let nulo = null;           // null (ausencia de valor)

let frutas = ["manzana", "pera", "uva"]; // array
let persona = { nombre: "Ana", edad: 30 }; // objeto

console.log(typeof nombre);     // "string"
console.log(typeof edad);       // "number"
console.log(typeof esAdulto);   // "boolean"
console.log(typeof indefinido); // "undefined"
console.log(nulo);              // null
console.log(frutas);            // ["manzana", "pera", "uva"]
console.log(persona);           // {nombre: "Ana", edad: 30}


// ------------------------------
// OPERADORES ARITMÉTICOS
// ------------------------------
let a = 10, b = 3;

console.log("a + b =", a + b); // 13
console.log("a - b =", a - b); // 7
console.log("a * b =", a * b); // 30
console.log("a / b =", a / b); // 3.333...
console.log("a % b =", a % b); // 1 (resto de la división) -> 10/3= 3, con resto 1


// ------------------------------
// OPERADORES DE ASIGNACIÓN
// ------------------------------
a += 5;  // a = a + 5 → 15
a -= 3;  // a = a - 3 → 12
a *= 2;  // a = a * 2 → 24
a /= 4;  // a = a / 4 → 6
console.log("Resultado final de a =", a);


// ------------------------------
// OPERADORES DE COMPARACIÓN
// ------------------------------
let c = 5, d = "5";

console.log("c == d:", c == d);   // true  (compara solo valor)
console.log("c === d:", c === d); // false (compara valor y tipo)
console.log("c != d:", c != d);   // false
console.log("c !== d:", c !== d); // true
console.log("c > 3:", c > 3);     // true
console.log("c <= 5:", c <= 5);   // true


// ------------------------------
// OPERADORES LÓGICOS
// ------------------------------
let esMayor = true;
let tieneCarnet = false;

console.log("AND (&&):", esMayor && tieneCarnet); // false
console.log("OR (||):", esMayor || tieneCarnet);  // true
console.log("NOT (!):", !esMayor);                // false

