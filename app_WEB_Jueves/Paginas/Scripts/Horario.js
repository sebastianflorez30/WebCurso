jQuery(function () {
    //Registrar los botones para responder al evento click
    $("#dvMenu").load("../Paginas/Menu.html")
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
    let Codigo = $("#txtCodigo").val();
    //Para el consultar, normalmente no se envía en el body una estructura, sino que se pasan los datos
    //por querystring
    //Solo se invoca el fetch
    try {
        const Respuesta = await fetch("http://localhost:62586/api/Horarios?Codigo=" + Codigo,
            {
                method: "GET",
                mode: "cors",
                headers: { "Content-Type": "application/json" }
            });
        //Leer la respuesta del servicio
        const Resultado = await Respuesta.json();
        //Presentar a respuesta en el html
        //El resultado está en formato JSON, y se puede acceder a las propiedades del json, a través del .
        $("#txtCodigoSesion").val(Resultado.CodigoSesion);
        $("#txtDiaSemana").val(Resultado.DiaSemana);
        $("#txtHoraInicio").val(Resultado.HoraInicio);
        $("#txtHoraFin").val(Resultado.HoraFin);            ;             
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
    let CodigoSesion = $("#txtCodigoSesion").val();
    let DiaSemana = $("#txtDiaSemana").val();
    let HoraInicio = $("#txtHoraInicio").val();
    let HoraFin = $("#txtHoraFin").val();      

    //Construir el json que se va a enviar al servicio
    let DatosHorario = {
        Codigo: Codigo,
        CodigoSesion: CodigoSesion,
        DiaSemana: DiaSemana,
        HoraInicio: HoraInicio,
        HoraFin: HoraFin
    }
    try {
        const Respuesta = await fetch("http://localhost:62586/api/Horarios",
            {
                method: Comando,
                mode: "cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(DatosHorario)
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
