function demo() {
    if (true) {
      var a = "Soy var";     // var = alcance de función
      let b = "Soy let";     // let = alcance de bloque
      const c = "Soy const"; // const = alcance de bloque
  
      console.log("Dentro del if:");
      console.log("a =", a); // ✅ "Soy var"
      console.log("b =", b); // ✅ "Soy let"
      console.log("c =", c); // ✅ "Soy const"
    }
  
    console.log("\nDentro de la función, pero fuera del if:");
    console.log("a =", a); // ✅ "Soy var" (se mantiene en toda la función)
    // console.log("b =", b); // ❌ Error: b is not defined
    // console.log("c =", c); // ❌ Error: c is not defined
  }
  
  demo();
  
  console.log("\nFuera de la función:");
  // console.log(a); // ❌ Error: a is not defined (var solo vive en la función)
  // console.log(b); // ❌ Error: b is not defined
  // console.log(c); // ❌ Error: c is not defined

  

  let nombre = "Juan"; // string
  let edad = 25;       // number