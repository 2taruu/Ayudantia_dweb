// ==============================
// OBJETOS
// ==============================
const persona = {
    nombre: "Juan",
    edad: 25,
    saludar() {                       
      console.log(`Hola, soy ${this.nombre}`);
    },
  };

  persona.saludar();                  // Hola, soy Juan
  console.log(persona.nombre);        // Acceso por punto -> "Juan"
  console.log(persona["edad"]);       // Acceso por corchetes -> 25
  
  // Acceso dinámico por clave:
  const clave = "nombre";
  console.log(persona[clave]);        // "Juan"
  
  // Destructuring (lectura rápida de propiedades):
  const { nombre: nombrePersona, edad } = persona;
  console.log(nombrePersona, edad);   // "Juan", 25
  
  
  // ==============================
  // EVENTOS (forma moderna con addEventListener)
  // ==============================
  
  // Recomendado: guardar referencias y verificar que existan antes de usar
  const btn = document.getElementById("miBoton");
  if (btn) {
    btn.addEventListener("click", () => {
      alert("¡Botón clickeado!");
    });
  }
  
  const form = document.getElementById("miFormulario");
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault(); // evita recarga
      console.log("Formulario enviado");
      // Ejemplo: leer un input
      // const valor = form.querySelector('input[name="nombre"]')?.value || "";
      // console.log("Nombre:", valor);
    });
  }
  
  
  
  // ==============================
  // MANEJO DE ERRORES (try / catch)
  // ==============================
  try {
    let x = y; // Sucede error, ya que y no esta definido
  } catch (error) {
    console.log("Se produjo un error:", error.message);
  } finally {
    console.log("Este bloque siempre se ejecuta");
  }