var oTabla = $("#tblEstudiante").DataTable();
jQuery(function () {
    //Registrar los botones para responder al evento click
    $("#dvMenu").load("../Paginas/Menu.html")
    LlenarTablaEstudiantes();
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

async function LlenarTablaEstudiantes() {
    //Invoca el método GET, del servicio de tipos de producto
    //Solo se invoca el fetch
    try {
        const Respuesta = await fetch("http://localhost:62586/api/Estudiantes",
            {
                method: "GET",
                mode: "cors",
                headers: { "Content-Type": "application/json" }
            });
        //Leer la respuesta del servicio
        const Resultado = await Respuesta.json();
        //Presentar a respuesta en el html
        //El resultado está en formato JSON con la lista de tipos de producto
        //Se debe recorrer para llenar la tabla
        //Llena el encabezado
        var Columnas = [];
        NombreColumnas = Object.keys(Resultado[0]);
        for (var i in NombreColumnas) {
            Columnas.push({
                data: NombreColumnas[i],
                title: NombreColumnas[i]
            });
        }
        //Llena los datos
        $("#tblEstudiante").DataTable({
            data: Resultado,
            columns: Columnas,
            destroy: true
        });
    }
    catch (_error) {
        //Presentar a respuesta del error en el html
        $("#dvMensaje").html(_error);
    }
}
async function Consultar() {
    let Documento = $("#txtDocumento").val();
    //Para el consultar, normalmente no se envía en el body una estructura, sino que se pasan los datos
    //por querystring
    //Solo se invoca el fetch
    try {
        const Respuesta = await fetch("http://localhost:62586/api/Estudiantes?Documento=" + Documento,
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
        $("#txtCorreo").val(Resultado.Correo);
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
    var Documento = $("#txtDocumento").val();
    let Nombre = $("#txtNombre").val();
    let PrimerApellido = $("#txtPrimerApellido").val();
    let SegundoApellido = $("#txtSegundoApellido").val();
    let Correo = $("#txtCorreo").val();
    let Telefono = $("#txtTelefono").val();    

    //Construir el json que se va a enviar al servicio
    let DatosEstudiante = {
        Documento: Documento,
        Nombre: Nombre,
        PrimerApellido: PrimerApellido,
        SegundoApellido: SegundoApellido,
        Correo: Correo,
        Telefono: Telefono        
    }
    try {
        const Respuesta = await fetch("http://localhost:62586/api/Estudiantes",
            {
                method: Comando,
                mode: "cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(DatosEstudiante)
            });
        //Leer la respuesta del servicio
        const Resultado = await Respuesta.json();
        //Presentar a respuesta en el html
        $("#dvMensaje").html(Resultado);

    } catch (_error) {
        //Presentar a respuesta del error en el html
        $("#dvMensaje").html(_error);
    }
}
