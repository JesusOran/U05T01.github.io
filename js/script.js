var vm = new Vue({
  el: "#name",
  data: {
    hotelName: ""
  }
});

var vmSelected = new Vue({
  el: "#noches",
  data: {
    selected: "",
    sale50: "14 noches",
    sale25: "7 noches"
  }
});

var now = new Date();
var day = ("0" + now.getDate()).slice(-2);
var month = ("0" + (now.getMonth() + 1)).slice(-2);
var today = now.getFullYear() + "-" + month + "-" + day;
document.getElementById("fechaEntrada").setAttribute("min", today);
var vmDate = new Vue({
  el: "#entrada",
  data: {
    fecha: today
  }
});

function getReserva() {
  var hotel = document.getElementById("hotel").value;
  var fecha = document.getElementById("fechaEntrada").value;
  var numNoches = document.getElementById("numNoches").value;
  var habitacionHuesped = document.getElementById("habitacionHuesped").value;
  var reserva = [hotel, fecha, numNoches, habitacionHuesped];

  return reserva;
}

Vue.component("button-search", {
  template:
    '<button v-on:click="updateMessage" type="button" class="btn btn-lg btn-primary">Buscar</button>',
  methods: {
    updateMessage: function() {
      alert(getReserva());
    }
  }
});

Vue.component("button-search-results", {
  data: function() {
    return {
      items: reserva
    };
  },
  template: "<div>{{ items }}</div>"
});

var vmSearch = new Vue({
  el: "#component-search"
});

var vmShow = new Vue({
  el: "#showTest",
  data: {
    boton: true
  },
  methods: {
    darkTheme: function() {
      document.body.style.backgroundColor = "black";
      document.body.style.color = "white";
    },
    lightTheme: function() {
      document.body.style.backgroundColor = "initial";
      document.body.style.color = "black";
    }
  }
});

const ultimoDiaPopular = 14;
const minHabitiaciones = 1;
const defaultAdultos = 2;
const habitacionesMaximas = 4;

var contenido = document.createElement("div");

var add = (function() {
  var counter = 1;
  return function(accion) {
    switch (accion) {
      case true:
        counter += 1;
        break;
      case -1:
        counter -= 1;
        break;
      case 0:
        counter = 0;
    }
    if (counter === 0) {
      counter = 1;
    }
    return counter;
  };
})();

diasEspecificos();

var nuevoFormulario = document.getElementById("seleccionar");
nuevoFormulario.addEventListener("click", huespedHabitacion);

function diasEspecificos() {
  var opcionDia = document.getElementById("numNoches");
  for (var i = 1; i <= ultimoDiaPopular; i++) {
    var opcion = document.createElement("option");
    if (i != 1) {
      var opcionTexto = document.createTextNode(i + " noches");
    } else {
      var opcionTexto = document.createTextNode(i + " noche");
    }
    opcion.appendChild(opcionTexto);
    opcionDia.appendChild(opcion);
  }
}

function huespedHabitacion() {
  var padre = document.getElementById("contenidos");
  var referencia = document.getElementById("seleccionar");
  padre.insertBefore(contenido, referencia.nextSibling.nextSibling);

  var numeroHabitaciones = document.createElement("h5");
  var adultos = document.createElement("label");
  var menores = adultos.cloneNode();
  var numeroAdultos = document.createElement("input");
  var numeroMenores = numeroAdultos.cloneNode();
  var adultosTexto = document.createTextNode("Adultos");
  var menoresTexto = document.createTextNode("Niños (0-17 años)");
  var textoHabitaciones = document.createTextNode(
    "Habitación " + minHabitiaciones
  );
  numeroHabitaciones.appendChild(textoHabitaciones);

  var nuevaHabitacion = document.createElement("button");
  var nuevaHabitacionTexto = document.createTextNode("Añadir habitación");
  nuevaHabitacion.setAttribute("class", "btn btn-primary");
  nuevaHabitacion.setAttribute("type", "button");
  nuevaHabitacion.addEventListener("click", habitacionExtra);
  nuevaHabitacion.appendChild(nuevaHabitacionTexto);

  var botonTerminar = nuevaHabitacion.cloneNode(true);
  botonTerminar.addEventListener("click", guardarSeleccion);
  botonTerminar.innerHTML = "Terminar";

  numeroAdultos.setAttribute("type", "number");
  numeroAdultos.setAttribute("min", "1");
  numeroAdultos.setAttribute("id", "campoAdultos");
  numeroAdultos.setAttribute("value", defaultAdultos);

  numeroMenores.setAttribute("id", "edadMenor");
  numeroMenores.setAttribute("type", "number");
  numeroMenores.setAttribute("value", 0);
  numeroMenores.setAttribute("min", "0");
  numeroMenores.setAttribute("max", "4");

  numeroMenores.addEventListener("change", edadMenor);

  adultos.appendChild(adultosTexto);
  menores.appendChild(menoresTexto);
  if (contenido.childNodes.length == 0) {
    add(0);
    contenido.appendChild(numeroHabitaciones);
    contenido.appendChild(adultos);
    contenido.appendChild(numeroAdultos);
    contenido.appendChild(menores);
    contenido.appendChild(numeroMenores);
    contenido.appendChild(nuevaHabitacion);
    contenido.appendChild(botonTerminar);
    contenido.setAttribute("class", "form-group contenido");
  } else {
    add(0);
  }
  nuevoFormulario.style.display = "none";
}

function guardarSeleccion() {
  var seleccionarHabitaciones = document.querySelectorAll(".contenido");
  var totalHabitaciones = seleccionarHabitaciones.length;
  var arrayTotalAdultos = [];
  var arrayTotalMenores = [];
  var arrayEdadMenores = [];
  for (var i = 0; i < totalHabitaciones; i++) {
    arrayTotalAdultos.push(
      parseInt(seleccionarHabitaciones[i].querySelector("#campoAdultos").value)
    );
    arrayTotalMenores.push(
      parseInt(seleccionarHabitaciones[i].querySelector("#edadMenor").value)
    );
    for (
      var k = 0;
      k < seleccionarHabitaciones[i].querySelectorAll(".campoEdad").length;
      k++
    ) {
      arrayEdadMenores.push(
        parseInt(
          seleccionarHabitaciones[i].querySelectorAll(".campoEdad")[k].value
        )
      );
    }
  }
  var totalAdultos = arrayTotalAdultos.reduce((a, b) => a + b, 0);
  var totalMenores = arrayTotalMenores.reduce((a, b) => a + b, 0);

  if (totalMenores != 0) {
    document.getElementById(
      "habitacionHuesped"
    ).value = `${totalHabitaciones} habitación/es, ${totalAdultos} adulto/s y ${totalMenores} menor/es (${arrayEdadMenores} años)`;
  } else {
    document.getElementById(
      "habitacionHuesped"
    ).value = `${totalHabitaciones} habitación/es y ${totalAdultos} adulto/s`;
  }

  seleccionarHabitaciones.forEach(element =>
    element.parentNode.removeChild(element)
  );
  document.getElementById("seleccionar").style.display = "initial";
}

function habitacionExtra() {
  var extraRoom = contenido.cloneNode(true);
  var nodosEdad = extraRoom.querySelectorAll(".campoEdad");
  if (nodosEdad != null) {
    nodosEdad.forEach(element => element.parentNode.removeChild(element));
  }
  extraRoom.lastChild.previousSibling.previousSibling.addEventListener(
    "change",
    edadMenor
  );
  if (add() < habitacionesMaximas) {
    var cerrar = document.createElement("button");
    var textoBoton = document.createTextNode("Eliminar habitación");

    cerrar.appendChild(textoBoton);
    cerrar.setAttribute("class", "btn btn-primary");
    cerrar.setAttribute("type", "button");

    function deleteRoom() {
      extraRoom.remove();
      add(-1);
    }
    cerrar.addEventListener("click", deleteRoom);

    extraRoom.lastChild.previousSibling.style.display = "none";
    extraRoom.lastChild.style.display = "none";
    extraRoom.appendChild(cerrar);
    extraRoom.firstChild.innerHTML = `Habitación ${add(true)}`;

    document.getElementById("contenidos").appendChild(extraRoom);
  } else {
    alert("Ha alcanzado el límite de habitaciones que puede reservar");
  }
}

function edadMenor(event) {
  var disparador = event.target;
  var cantidad = disparador.value;
  var nodosEdad = disparador.parentNode.querySelectorAll(".campoEdad");

  if (nodosEdad != null) {
    nodosEdad.forEach(element => element.parentNode.removeChild(element));
  }
  var padre = disparador.parentNode;
  var referencia = disparador.nextElementSibling;

  for (var i = 0; i < cantidad; i++) {
    var edadNinio = document.createElement("input");
    edadNinio.setAttribute("type", "number");
    edadNinio.setAttribute("min", "1");
    edadNinio.setAttribute("value", "1");
    edadNinio.setAttribute("max", "17");
    edadNinio.setAttribute("class", "m-2 campoEdad");
    padre.insertBefore(edadNinio, referencia);
  }
}
