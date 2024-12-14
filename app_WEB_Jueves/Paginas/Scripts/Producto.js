var oTabla = $("#tblProductos").DataTable();
var Token = getCookie("token");

jQuery(function () {
    $("#dvMenu").load("../Paginas/Menu.html");
    //Invoca la función que llena el combo de tipos de producto
    LlenarComboTipoProducto();
    LlenarTablaProductos();
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
async function LlenarTablaProductos() {
    LlenarTablaXServiciosAuth("http://localhost:58511/api/Productos", "#tblProductos");
}
async function LlenarComboTipoProducto() {
    LlenarComboXServiciosAuth("http://localhost:58511/api/TipoProductos", "#cboTipoProducto");
}
/*
async function LlenarTablaProductos() {
    //Invoca el método GET, del servicio de tipos de producto
    //Solo se invoca el fetch
    try {
        const Respuesta = await fetch("http://localhost:58511/api/Productos",
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
        $("#tblProductos").DataTable({
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

async function LlenarComboTipoProducto() {
    //Invoca el método GET, del servicio de tipos de producto
    //Solo se invoca el fetch
    try {
        const Respuesta = await fetch("http://localhost:58511/api/TipoProductos",
            {
                method: "GET",
                mode: "cors",
                headers: { "Content-Type": "application/json" }
            });
        //Leer la respuesta del servicio
        const Resultado = await Respuesta.json();
        //Presentar a respuesta en el html
        //El resultado está en formato JSON con la lista de tipos de producto
        //Se debe recorrer para llenar el combo
        for (i = 0; i < Resultado.length; i++) {
            $("#cboTipoProducto").append('<option value="' + Resultado[i].Codigo + '">' + Resultado[i].Nombre + '</option>');
        }
    }
    catch (_error) {
        //Presentar a respuesta del error en el html
        $("#dvMensaje").html(_error);
    }
}
*/
async function Consultar() {
    let Codigo = $("#txtCodigo").val();
    //Para el consultar, normalmente no se envía en el body una estructura, sino que se pasan los datos
    //por querystring
    //Solo se invoca el fetch
    try {
        const Respuesta = await fetch("http://localhost:58511/api/Productos?id=" + Codigo,
            {
                method: "GET",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": 'Bearer ' + Token
                }
            });
        //Leer la respuesta del servicio
        const Resultado = await Respuesta.json();
        if (Resultado != null) {
            $("#txtNombre").val(Resultado.Nombre);
            $("#txtDescripcion").val(Resultado.Descripcion);
            $("#txtCantidad").val(Resultado.Cantidad);
            $("#txtValorUnitario").val(Resultado.ValorUnitario);
            $("#cboTipoProducto").val(Resultado.CodigoTipoProducto);
            $("#dvMensaje").html("");
        }
        else {
            $("#txtNombre").val("");
            $("#txtDescripcion").val("");
            $("#txtCantidad").val("");
            $("#txtValorUnitario").val("");
            $("#cboTipoProducto").val(1);
            $("#dvMensaje").html("No hay datos para el producto consultado");
        }
    }
    catch (_error) {
        //Presentar a respuesta del error en el html
        $("#dvMensaje").html(_error);
    }
}
async function EjecutarComando(Comando) {
    let Codigo = $("#txtCodigo").val();
    let Nombre = $("#txtNombre").val();
    let Descripcion = $("#txtDescripcion").val();
    let Cantidad = $("#txtCantidad").val();
    let ValorUnitario = $("#txtValorUnitario").val();
    let TipoProducto = $("#cboTipoProducto").val();

    //Construir el json que se va a enviar al servicio
    let DatosProducto = {
        Codigo: Codigo,
        Nombre: Nombre,
        Descripcion: Descripcion,
        Cantidad: Cantidad,
        ValorUnitario: ValorUnitario,
        CodigoTipoProducto: TipoProducto
    }

    //Enviar los datos al servicio, a través de la función fetch de javascript
    //Los datos del cliente, se pasan por body, en formato json
    //Javascript, tiene un objeto JSON, que permite cambiar de una etructura json, a un texto con formato json
    try {
        const Respuesta = await fetch("http://localhost:58511/api/Productos",
            {
                method: Comando,
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": 'Bearer ' + Token
                },
                body: JSON.stringify(DatosProducto)
            });
        //Leer la respuesta del servicio
        const Resultado = await Respuesta.json();
        //Al terminar de hacer el proceso de inserción, actualización o eliminación, se llena nuevamente
        //la tabla para ver los cambios actualizados
        LlenarTablaProductos();
        //Presentar a respuesta en el html
        $("#dvMensaje").html(Resultado);
    }
    catch (_error) {
        //Presentar a respuesta del error en el html
        $("#dvMensaje").html(_error);
    }
}
