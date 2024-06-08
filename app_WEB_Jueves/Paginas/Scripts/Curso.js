//var oTabla = $("#tblCursos").DataTable();
jQuery(function () {
    //Registrar los botones para responder al evento click
    $("#dvMenu").load("../Paginas/Menu.html")
    //Invoca la función que llena el combo de tipos de producto
    LlenarComboProfesor();
    LlenarComboEstudiante();
    LlenarTablaCursos();
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

async function LlenarTablaCursos() {
    //Invoca el método GET, del servicio de tipos de producto
    //Solo se invoca el fetch
    try {
        const Respuesta = await fetch("http://localhost:58511/api/Cursos",
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
        $("#tblCursos").DataTable({
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
async function LlenarComboProfesor() {
    try {
        const Respuesta = await fetch("http://localhost:62586/api/Profesores",
            {
                method: "GET",
                mode: "cors",
                headers: { "Content-Type": "application/json" }
            });
        //Leer la respuesta del servicio
        const Resultado = await Respuesta.json();
        for (i = 0; i < Resultado.length; i++) {
            $("#cboDocumentoProfesor").append('<option value="' + Resultado[i].Documento + '">' + Resultado[i].Nombre+" "+ Resultado[i].PrimerApellido + '</option>');
        }
    }
    catch (_error) {
        //Presentar a respuesta del error en el html
        $("#dvMensaje").html(_error);
    }
}

async function LlenarComboEstudiante() {
    try {
        const Respuesta = await fetch("http://localhost:62586/api/Estudiantes",
            {
                method: "GET",
                mode: "cors",
                headers: { "Content-Type": "application/json" }
            });
        //Leer la respuesta del servicio
        const Resultado = await Respuesta.json();
        for (i = 0; i < Resultado.length; i++) {
            $("#cboDocumentoEstudiante").append('<option value="' + Resultado[i].Documento + '">' + Resultado[i].Nombre + " " + Resultado[i].PrimerApellido + '</option>');
        }
    }
    catch (_error) {
        //Presentar a respuesta del error en el html
        $("#dvMensaje").html(_error);
    }
}



async function Consultar() {
    let Codigo = $("#txtCodigo").val();
    //Para el consultar, normalmente no se envía en el body una estructura, sino que se pasan los datos
    //por querystring
    //Solo se invoca el fetch
    try {
        const Respuesta = await fetch("http://localhost:62586/api/Cursos?Codigo=" + Codigo,
            {
                method: "GET",
                mode: "cors",
                headers: { "Content-Type": "application/json" }
            });
        //Leer la respuesta del servicio
        const Resultado = await Respuesta.json();
        if (Resultado != null) {
            //Presentar a respuesta en el html
            //El resultado está en formato JSON, y se puede acceder a las propiedades del json, a través del .
            $("#txtNombre").val(Resultado.Nombre);
            $("#txtDescripcion").val(Resultado.Descripcion);
            $("#txtDuracion").val(Resultado.Duracion);
            $("#txtNivel").val(Resultado.Nivel);
            $("#cboDocumentoProfesor").val(Resultado.DocumentoProfesor);
            $("#txtDocumentoEstudiante").val(Resultado.DocumentoEstudiante);
            $("#txtCodigoAsistencia").val(Resultado.CodigoAsistencia);
            $("#txtCodigoEvaluacion").val(Resultado.CodigoEvaluacion);
            $("#txtCodigoCalificacion").val(Resultado.CodigoCalificacion);
            $("#dvMensaje").html("")
        }
        else {
            $("#txtNombre").val("");
            $("#txtDescripcion").val("");
            $("#txtDuracion").val("");
            $("#txtNivel").val("");
            $("#cboDocumentoProfesor").val(1);
            $("#txtDocumentoEstudiante").val("");
            $("#txtCodigoAsistencia").val("");
            $("#txtCodigoEvaluacion").val("");
            $("#txtCodigoCalificacion").val("");
            $("#dvMensaje").html("No hay datos para el curso consultado")
        }
                     
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
    var Codigo = $("#txtCodigo").val();
    let Nombre = $("#txtNombre").val();
    let Descripcion = $("#txtDescripcion").val();
    let Duracion = $("#txtDuracion").val();
    let Nivel = $("#txtNivel").val();
    let CodigoAsignatura = $("#txtCodigoAsignatura").val();
    let DocumentoProfesor = $("#cboDocumentoProfesor").val();
    let DocumentoEstudiante = $("#cboDocumentoEstudiante").val();
    let CodigoAsistencia = $("#txtCodigoAsistencia").val();
    let CodigoEvaluacion = $("#txtCodigoEvaluacion").val();
    let CodigoCalificacion = $("#txtCodigoCalificacion").val();
    

    //Construir el json que se va a enviar al servicio
    let DatosCurso = {
        Codigo: Codigo,
        Nombre: Nombre,
        Descripcion: Descripcion,
        Duracion: Duracion,
        Nivel: Nivel,
        CodigoAsignatura: CodigoAsignatura,
        DocumentoProfesor: DocumentoProfesor,
        DocumentoEstudiante: DocumentoEstudiante,
        CodigoAsistencia: CodigoAsistencia,
        CodigoEvaluacion: CodigoEvaluacion,
        CodigoCalificacion: CodigoCalificacion
    }
    try {
        const Respuesta = await fetch("http://localhost:62586/api/Cursos",
            {
                method: Comando,
                mode: "cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(DatosCurso)
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
