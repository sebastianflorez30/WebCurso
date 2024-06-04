jQuery(function () {
    //Registrar los botones para responder al evento click
    $("#dvMenu").load("../Paginas/Menu.html");
    //Asociar el click al botón btnInsertar
    //Vamos a utilizar jquery para conectar objetos
    //Utiliza $("#Nombre del objeto")
    //      $("#....").val(); Permite capturar y asignar valores a los objetos
    //      $("#....").on(), permite levantar eventos
    $("#btnInsertar").on("click", function () {
        //Lo que se escriba en este código, es lo que se va a invocar al hacer click en el botón "Insertar"
        //Para invocar una función en javascript, se escribe el nombre de esta terminando con paréntesis (Parámetros)
        Insertar();
    });
});
//Crear la función insertar
async function Insertar() {
    //Capturar los datos de entrada
    let Documento = $("#txtDocumento").val();
    let Nombre = $("#txtNombre").val();
    let HorasReserva = $("#cboHoras").val();
    let DiaReserva = $("#txtDiaReserva").val();

    //Crear la estructura json, con los datos de la reserva
    let DatosReserva = {
        Documento: Documento,
        Nombre: Nombre,
        HorasReserva: HorasReserva,
        DiaReserva: DiaReserva
    }

    //Invocar el método fetch para llamar el servicio
    //Enviar los datos al servicio, a través de la función fetch de javascript
    //Los datos del cliente, se pasan por body, en formato json
    //Javascript, tiene un objeto JSON, que permite cambiar de una etructura json, a un texto con formato json
    try {
        const Respuesta = await fetch("http://localhost:58511/api/Reservas",
            {
                method: "POST",
                mode: "cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(DatosReserva)
            });
        //Leer la respuesta del servicio
        const Resultado = await Respuesta.json();
        //Presentar a respuesta en el html
        $("#dvMensaje").html(Resultado);
    }
    catch (_error) {
        //Presentar a respuesta del error en el html
        $("#dvMensaje").html(_error);
    }
}