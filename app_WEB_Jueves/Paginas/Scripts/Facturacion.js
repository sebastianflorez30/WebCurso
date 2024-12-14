jQuery(function () {
    //Registrar los botones para responder al evento click
    $("#dvMenu").load("../Paginas/Menu.html");
    $("#txtNumeroFactura").val("0");
    LLenarComboEmpleados();
    LlenarComboTipoProducto();
});
function LLenarComboEmpleados() {
    LlenarComboXServiciosAuth("http://localhost:58511/api/Empleados/LlenarCombo", "#cboEmpleado");
}
function LlenarTablaFactura() {
    let NumeroFactura = $("#txtNumeroFactura").val();
    LlenarTablaXServiciosAuth("http://localhost:58511/api/Facturacion/LlenarTablaFactura?NumeroFactura=" + NumeroFactura, "#tblFactura");
}
async function LlenarComboTipoProducto() {
    let rpta = await LlenarComboXServiciosAuth("http://localhost:58511/api/TipoProductos/LlenarCombo", "#cboTipoProducto");
    LlenarComboProducto();
}
async function LlenarComboProducto() {
    let idTipoProducto = $("#cboTipoProducto").val();
    let rpta = await LlenarComboXServiciosAuth("http://localhost:58511/api/Productos/LlenarCombo?idTipoProducto=" + idTipoProducto, "#cboProducto");
    PresentarValorUnitario();
}
function PresentarValorUnitario() {
    let DatosProducto = $("#cboProducto").val();
    let CodigoProducto = DatosProducto.split('|')[0];
    let ValorUnitario = DatosProducto.split('|')[1];

    $("#txtValorUnitarioTexto").val(FormatoMiles(ValorUnitario));
    $("#txtValorUnitario").val(ValorUnitario);
    $("#txtCodigoProducto").val(CodigoProducto);
    CalcularSubtotal();
}
function GrabarFactura() {
    $("#txtNumeroFactura").val("0");
    $("#txtDocumento").val("");
    $("#txtNombreCliente").val("");
    var table = new DataTable('#tblFactura');
    table.clear().draw();
}
function CalcularSubtotal() {
    let ValorUnitario = $("#txtValorUnitario").val();
    let Cantidad = $("#txtCantidad").val();
    $("#txtSubtotal").val(FormatoMiles(Cantidad * ValorUnitario));
}
async function Consultar() {
    let Documento = $("#txtDocumento").val();
    //Para el consultar, normalmente no se envía en el body una estructura, sino que se pasan los datos
    //por querystring
    //Solo se invoca el fetch
    try {
        let Token = getCookie("token");

        const Respuesta = await fetch("http://localhost:58511/api/Clientes?Documento=" + Documento,
            {
                method: "GET",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': 'Bearer ' + Token
                }
            });
        //Leer la respuesta del servicio
        const Resultado = await Respuesta.json();
        //Presentar a respuesta en el html
        //El resultado está en formato JSON, y se puede acceder a las propiedades del json, a través del .
        $("#txtNombreCliente").val(Resultado.Nombre + " " + Resultado.PrimerApellido + " " + Resultado.SegundoApellido);
    }
    catch (_error) {
        //Presentar a respuesta del error en el html
        $("#dvMensaje").html(_error);
    }
}
async function GrabarProducto() {
    let NumeroFactura = $("#txtNumeroFactura").val();
    let Documento = $("#txtDocumento").val();
    let idEmpleado = $("#cboEmpleado").val();
    let CodigoProducto = $("#txtCodigoProducto").val();
    let Cantidad = $("#txtCantidad").val();
    let ValorUnitario = $("#txtValorUnitario").val();

    let DatosFactura = {
        Numero: NumeroFactura,
        Documento: Documento,
        Fecha: "2024/01/01",
        CodigoEmpleado: idEmpleado
        }
    let Token = getCookie("token");
    if (NumeroFactura == 0) {
        //Se graba el encabezado
        try {
            const Respuesta = await fetch("http://localhost:58511/api/Facturacion/GrabarEncabezado",
                {
                    method: "POST",
                    mode: "cors",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': 'Bearer ' + Token
                    },
                    body: JSON.stringify(DatosFactura)
                });
            //Leer la respuesta del servicio
            const Resultado = await Respuesta.json();
            NumeroFactura = Resultado;
            $("#txtNumeroFactura").val(NumeroFactura);
        }
        catch (_error) {
            //Presentar a respuesta del error en el html
            $("#dvMensaje").html(_error);
        }
    }
    //Se graba el detalle
    let DatosDetalleFactura = {
        Numero: NumeroFactura,
        CodigoProducto: CodigoProducto,
        Cantidad: Cantidad,
        ValorUnitario: ValorUnitario
    }
    try {
        const Respuesta = await fetch("http://localhost:58511/api/Facturacion/GrabarDetalle",
            {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': 'Bearer ' + Token
                },
                body: JSON.stringify(DatosDetalleFactura)
            });
        //Leer la respuesta del servicio
        const Resultado = await Respuesta.json();
        LlenarTablaFactura();
    }
    catch (_error) {
        //Presentar a respuesta del error en el html
        $("#dvMensaje").html(_error);
    }
}
async function Eliminar(idDetalle) {
    let Token = getCookie("token");
    try {
        const Respuesta = await fetch("http://localhost:58511/api/Facturacion/EliminarDetalle?idDetalleFactura=" + idDetalle,
            {
                method: "DELETE",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': 'Bearer ' + Token
                }
            });
        //Leer la respuesta del servicio
        const Resultado = await Respuesta.json();
        LlenarTablaFactura();
    }
    catch (_error) {
        //Presentar a respuesta del error en el html
        $("#dvMensaje").html(_error);
    }
}