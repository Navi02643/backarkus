// Fetch('http://localhost:5000/api/cards/assigned')

// fetch('http://localhost:5000/api/cards/assigned')
// .then(response => response.json())
// .then(json => console.log(json))

module.exports = ({ equipment }) => {
  const today = new Date();
  const mounthsname = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  const currentdate = `Aguascalientes, Ags a ${today.getDate()} de ${
    mounthsname[today.getMonth()]
  } del año ${today.getFullYear()}`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <p style="text-align: right;"> ${currentdate}</p>
<p style="text-align: center;">ASIGNACIÓN DE EQUIPO DE TRABAJO </p>
<p>Cuenta: MindTeams </p>
<p style="text-align: center;">DESCRIPCIÓN </p>
<table class="default">
  <tr>
    <th>Elemento</th>
    <th>Marca</th>
    <th>Modelo</th>
    <th>No. de Serie</th>
  </tr>
  <tr>
    <td>${equipment}</td>
    <td>${equipment}</td>
    <td>${equipment}</td>
    <td>${equipment}</td>
  </tr>
</table>

<p style="text-align: center;">DECLARACIÓN</p>
<p>Por medio de la presente declaro recibir lo anteriormente descrito, comprometiéndose a mantenerlo en el estado en el
    que lo recibo salvo el deterioro normal por su uso, cuidándolo como si él mismo fuera de mi propiedad, en el
    entendido de que en caso de que el mismo se pierda o sufra cualquier daño ocasionado por su dolo o negligencia, me
    haré responsable del costo de sustitución o reparación del mismo.</p>
<p>En caso de que por causas inherentes al uso y desgaste normales del equipo este requiera alguna reparación, el
    colaborador notificará tal circunstancia a la empresa, para que la misma indique las condiciones en la que las
    reparaciones o trabajo de mantenimiento sobre el mismo habrán de realizarse.</p>
<p>El colaborador reconoce que el equipo que se le entrega, sólo podrá ser utilizado para cumplir con las tareas que le
    encomienda la empresa y que no podrá hacer uso del mismo para cuestiones de carácter personal. Asimismo se
    compromete a emplear el equipo únicamente de acuerdo con las condiciones y especificaciones que para dichos efectos
    haga de su conocimiento la empresa.</p>
<p>En caso de tratarse de equipo de cómputo, se compromete a no cambiarlo de lugar, ni modificarlo ni en el hardware ni
    en el software, es decir no agregar ni suprimir ningún programa de los que se encuentren cargados originalmente o
    que sean adicionados posteriormente por el personal autorizado de la empresa, sin el expreso consentimiento por
    escrito de esta.</p>
<p>El colaborador reconoce que los derechos sobre el equipo objeto de la presente corresponden exclusivamente a la
    empresa, por lo que se obliga a devolver el equipo a la empresa en caso de terminar su relación laboral, deberá de
    entregar los equipos, accesorios o cualquier dispositivo que se le haya entregado al personal de IT en el mismo
    estado en que los haya recibido, salvo el deterioro que presente al momento de la entrega debido al uso normal y
    correcto, si se encontrase trabajando fuera del estado o país, el colaborador asumirá el costo del envío de los
    equipos, accesorios o dispositivos que se le hayan entregado a la oficina de Arkusnexus. </p>
<table>
    <tr style="column-width: 50%;">
        <td style=" padding: 5%;">COLABORADOR</td>
        <td style=" padding: 5%;">AUTORIZACIÓN DE IT</td>
    </tr>
    <tr style="column-width: 50%;">
        <td style="border-bottom: 1px solid black; padding: 5%;"></td>
        <td style="border-bottom: 1px solid black; padding: 5%;"></td>
    </tr>
    <tr>
        <td style=" padding: 5%;"></td>
        <td style=" padding: 5%;"></td>
    </tr>
    <tr>
        <td class="title"><img  src="/server/logo.png"
        style="width:100%; max-width:156px;"></td>
    </tr>
</table>


</body>
</html>
    `;
};
