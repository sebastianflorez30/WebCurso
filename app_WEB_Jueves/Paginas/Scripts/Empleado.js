jQuery(function () {
    $("#dvMenu").load("../Paginas/Menu.html");
    $("#btnInsertar").on("click", function () {
        EjecutarComando("POST");
    });
    $("#btnActualizar").on("click", function () {
        EjecutarComando("PUT");
    });
    $("#btnEliminar").on("click", function () {
        EjecutarComando("DELETE");
    });
    $("#btnConsultar").on("click", function () {
        Consultar();
    });
});
async function Consultar() {
    let Documento = $("#txtDocumento").val();
    //Para el consultar, normalmente no se envía en el body una estructura, sino que se pasan los datos
    //por querystring
    //Solo se invoca el fetch
    try {
        const Respuesta = await fetch("http://localhost:58511/api/Empleados?Documento=" + Documento,
            {
                method: "GET",
                mode: "cors",
                headers: { "Content-Type": "application/json" }
            });
        //Leer la respuesta del servicio
        const Resultado = await Respuesta.json();
        //Presentar a respuesta en el html
        //El resultado está en formato JSON, y se puede acceder a las propiedades del json, a través del .
        $("#txtNombre").val(Resultado.Nombre);
        $("#txtPrimerApellido").val(Resultado.PrimerApellido);
        $("#txtSegundoApellido").val(Resultado.SegundoApellido);
        $("#txtDireccion").val(Resultado.Direccion);
        $("#txtFechaNacimiento").val(Resultado.FechaNacimiento.split('T')[0]);
        $("#txtTelefono").val(Resultado.Telefono);
    }
    catch (_error) {
        //Presentar a respuesta del error en el html
        $("#dvMensaje").html(_error);
    }
}
async function EjecutarComando(Comando) {
    //Capturar los datos de entrada
    //Definición de variables en javascript: let, var. let define variables locales para la función,
    //var define variables globales para la página
    let Documento = $("#txtDocumento").val();
    let Nombre = $("#txtNombre").val();
    let PrimerApellido = $("#txtPrimerApellido").val();
    let SegundoApellido = $("#txtSegundoApellido").val();
    let Direccion = $("#txtDireccion").val();
    let FechaNacimiento = $("#txtFechaNacimiento").val();
    let Telefono = $("#txtTelefono").val();

    //Construir el json que se va a enviar al servicio
    let DatosEmpleado = {
        Documento: Documento,
        Nombre: Nombre,
        PrimerApellido: PrimerApellido,
        SegundoApellido: SegundoApellido,
        Direccion: Direccion,
        FechaNacimiento: FechaNacimiento,
        Telefono: Telefono
    }

    //Enviar los datos al servicio, a través de la función fetch de javascript
    //Los datos del cliente, se pasan por body, en formato json
    //Javascript, tiene un objeto JSON, que permite cambiar de una etructura json, a un texto con formato json
    try {
        const Respuesta = await fetch("http://localhost:58511/api/Empleados",
            {
                method: Comando,
                mode: "cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(DatosEmpleado)
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