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

async function Insertar() {
    //Capturar los datos de entrada
    //Definición de variables en javascript: let, var. let define variables locales para la función,
    //var define variables globales para la página
    var Documento = $("#txtDocumento").val();
    let Nombre = $("#txtNombre").val();
    let PrimerApellido = $("#txtPrimerApellido").val();
    let SegundoApellido = $("#txtSegundoApellido").val();
    let Direccion = $("#txtDireccion").val();
    let FechaNacimiento = $("#txtFechaNacimiento").val();
    let Email = $("#txtEmail").val();

    //Construir el json que se va a enviar al servicio
    let DatosCliente = {
        Documento: Documento,
        Nombre: Nombre,
        PrimerApellido: PrimerApellido,
        SegundoApellido: SegundoApellido,
        Direccion: Direccion,
        FechaNacimiento: FechaNacimiento,
        Email: Email
    }

    //Enviar los datos al servicio, a través de la función fetch de javascript
    //Los datos del cliente, se pasan por body, en formato json
    //Javascript, tiene un objeto JSON, que permite cambiar de una etructura json, a un texto con formato json
    try {
        const Respuesta = await fetch("http://localhost:58511/api/Clientes",
            {
                method: "POST",
                mode: "cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(DatosCliente)
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