const boton_buscar = document.querySelector("#boton_buscar");
let data_json = "";
let buscar_moneda_seleccionada = "";
let input_recibido = "";
let conversor_moneda = "";
let dato_fecha = "";
let dato_valor = "";
let fechas_grafico = "";
let data_grafico = "";
const myChart = document.getElementById("myChart");
boton_buscar.addEventListener("click", principal);

async function principal() {
  const moneda = document.querySelector("#monedas").value;
  validar_inpunt_usuario();
  validacion_seleccion_moneda(moneda);
  await llamar_Api();
  transformar_data();
  ingresa_resultado_dom(conversor_moneda);
  await obtener_datos_grafico(buscar_moneda_seleccionada);
  filtrar_data_grafico();
  Pintar_grafica();
}

function validar_inpunt_usuario() {
  input_recibido = document.querySelector("#input_usuario").value;
  console.log("Validar inpunt recibido" + input_recibido);
  if (input_recibido >= 0 && input_recibido != "") {
    console.log("Validación númerica completa" + input_recibido);
  } else {
    alert("Campo inválido");
  }
}

async function llamar_Api() {
  //Llamando datos para conversión
  try {
    const respuesta = await fetch("https://mindicador.cl/api/");
    data_json = await respuesta.json();
    console.log("Respuesta de Api", data_json);
  } catch (error) {
    ingresa_resultado_dom(error);
  }
}

async function obtener_datos_grafico(buscar_moneda_seleccionada) {
  try {
    const res = await fetch(
      `https://mindicador.cl/api/${buscar_moneda_seleccionada}`
    );
    const valor_mes = await res.json();
    console.log(valor_mes);

    dato_fecha = valor_mes.serie.map((valor_mes) => {
      return valor_mes.fecha;
    });
    console.log("Nuevo arreglo, fecha", dato_fecha);

    dato_valor = valor_mes.serie.map((valor_mes) => {
      return valor_mes.valor;
    });
    console.log("Nuevo arreglo, valor", dato_valor);
  } catch (error) {
    ingresa_resultado_dom(error);
  }
}

function validacion_seleccion_moneda(moneda) {
  switch (moneda) {
    case "1":
      buscar_moneda_seleccionada = "uf";
      console.log("Moneda a buscar es: ", buscar_moneda_seleccionada);
      break;
    case "2":
      buscar_moneda_seleccionada = "utm";
      console.log("Moneda a buscar es: ", buscar_moneda_seleccionada);
      break;
    default:
      buscar_moneda_seleccionada = "Seleccione moneda válida";
      console.log("Moneda a buscar es: ", buscar_moneda_seleccionada);
  }
}

function transformar_data() {
  const valor_moneda = data_json[buscar_moneda_seleccionada].valor;
  console.log("El valor de la moneda seleccionada es", valor_moneda);
  conversor_moneda = input_recibido / valor_moneda;
  console.log(conversor_moneda);
}

function ingresa_resultado_dom(texto_a_pintar) {
  const resultado = document.querySelector("#resultado_conversion");
  resultado.textContent = `Resultado: ${texto_a_pintar}`;
  document.querySelector("#input_usuario").value = "";
}

function filtrar_data_grafico() {
  fechas_grafico = dato_fecha.slice(0, 10);
  data_grafico = dato_valor.slice(0, 10);
  console.log("Los diez último días son:", fechas_grafico);
  console.log("Los diez últimos valores son:", data_grafico);
}

function Pintar_grafica() {
  const config = {
    type: "line",
    data: {
      labels: fechas_grafico,
      datasets: [
        {
          label: "Valores de moneda",
          data: data_grafico,
          fill: false,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ],
    },
  };

  myChart.style.backgroundColor = "white";
  new Chart(myChart, config);
}
