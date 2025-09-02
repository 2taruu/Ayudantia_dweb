// ==============================
// CONDICIONALES
// ==============================

// if / else (usa el mismo identificador que evalúas)
const edad = 20;
if (edad >= 18) {
  console.log("Eres mayor de edad.");
} else {
  console.log("Eres menor de edad.");
}

// Operador ternario (equivalente compacto de if/else)
const edad2 = 16;
const resultado = edad2 >= 18 ? "Mayor" : "Menor";
console.log("Resultado (ternario):", resultado);

// ==============================
// BUCLES
// ==============================

// for clásico (cuando sabes cuántas iteraciones habrá)
for (let i = 0; i < 5; i++) {
  console.log("for i =", i);
}

// for...in (recorre claves/propiedades de un OBJETO)
const usuario = { nombre: "Juan", edad: 25 };
for (const propiedad in usuario) {
  console.log(`${propiedad}: ${usuario[propiedad]}`);
}


// for...of (recorre valores de un ITERABLE como un ARRAY)
const frutas = ["manzana", "banana", "mango"];
for (const fruta of frutas) {
  console.log("for...of fruta =", fruta);
}

// while (mientras la condición sea verdadera)
let i = 0;
while (i < 5) {
  console.log("while i =", i);
  i++;
}

// ==============================
// FUNCIONES
// ==============================

// Declaración de función (hoisting: puedes llamarla antes de su definición)
function saludarDecl(nombre) {
  console.log("Hola (decl), " + nombre);
}
saludarDecl("Juan");

// Expresión de función (asignada a una variable)
const saludarExpr = function (nombre) {
  console.log("Hola (expr), " + nombre);
};
saludarExpr("Pedro");

// Función flecha (sintaxis moderna y concisa)
const saludarFlecha = (nombre) => {
  console.log("Hola (flecha), " + nombre);
};
saludarFlecha("Ana");

// ==============================
// ARRAYS (acceso y utilidades básicas)
// ==============================
const frutas2 = ["manzana", "banana", "mango"];
console.log("Primer elemento:", frutas2[0]); // manzana

frutas2.push("naranja"); // Añadir al final
frutas2.forEach((f, idx) => console.log(`frutas2[${idx}] = ${f}`));


// ==============================
// ARRAYS ALREVES
// ==============================
const frutas3 = ["manzana", "banana", "mango", "naranja"];

// con for
for (let i = frutas3.length - 1; i >= 0; i--) {
  console.log(`frutas[${i}] = ${frutas3[i]}`);
}
// iterandolo con funcion
frutas3.slice().reverse().forEach((f, idx) => {
  console.log(`Elemento ${idx}: ${f}`);
});

// iterandolo con while
let j = frutas3.length - 1;
while (j >= 0) {
  console.log(frutas[j]);
  j--;
}