/*=========================================================
 MEBRI Lite
 app.js
 Versión 1.0
=========================================================*/

/*=========================================================
CONFIGURACIÓN
=========================================================*/

const STORAGE_KEY = "MEBRI_LITE";

/*=========================================================
BASE METODOLÓGICA
=========================================================*/

const PROPERTIES = [

{
nombre:"Diversidad funcional",
definicion:"Existencia de múltiples actores con funciones complementarias dentro del sistema de Gestión del Riesgo de Desastres.",
pregunta:"¿El sistema cuenta con actores diversos y capacidades complementarias para gestionar el riesgo?",
indicadores:[
"Diversidad sectorial",
"Participación pública",
"Participación privada",
"Participación comunitaria",
"Complementariedad institucional"
]
},

{
nombre:"Conectividad",
definicion:"Capacidad de comunicación y coordinación entre instituciones.",
pregunta:"¿La información fluye oportunamente entre niveles y sectores?",
indicadores:[
"Protocolos",
"Interoperabilidad",
"Reuniones",
"Canales de comunicación",
"Tiempos de respuesta"
]
},

{
nombre:"Cooperación",
definicion:"Capacidad de trabajo conjunto entre instituciones y actores sociales.",
pregunta:"¿Existen mecanismos permanentes de cooperación?",
indicadores:[
"Convenios",
"Mesas técnicas",
"Redes",
"Alianzas",
"Proyectos conjuntos"
]
},

{
nombre:"Retroalimentación",
definicion:"Capacidad institucional para aprender de experiencias anteriores.",
pregunta:"¿Las lecciones aprendidas modifican decisiones futuras?",
indicadores:[
"Informes",
"Actualización de planes",
"Simulacros",
"Protocolos",
"Aprendizaje"
]
},

{
nombre:"Adaptabilidad",
definicion:"Capacidad para ajustarse frente a cambios y nuevas amenazas.",
pregunta:"¿El sistema se adapta a escenarios cambiantes?",
indicadores:[
"Innovación",
"Cambio climático",
"Actualización",
"Flexibilidad",
"Riesgos emergentes"
]
},

{
nombre:"Redundancia",
definicion:"Existencia de capacidades alternativas para mantener funciones críticas.",
pregunta:"¿Existen mecanismos alternativos cuando falla un actor?",
indicadores:[
"Fondos",
"Rutas alternas",
"Respaldos",
"Capacidades distribuidas",
"Continuidad"
]
},

{
nombre:"Modularidad",
definicion:"Capacidad de operar de manera autónoma sin comprometer el conjunto.",
pregunta:"¿Cada nivel o sector posee autonomía funcional?",
indicadores:[
"Competencias",
"Autonomía",
"Descentralización",
"Protocolos",
"Capacidad local"
]
},

{
nombre:"Autoorganización",
definicion:"Capacidad para responder sin depender exclusivamente de órdenes jerárquicas.",
pregunta:"¿Los actores pueden coordinar respuestas propias?",
indicadores:[
"Liderazgo",
"Redes",
"Iniciativas",
"Organización",
"Capacidades instaladas"
]
},

{
nombre:"Diversidad de conocimiento",
definicion:"Integración de saberes científicos, técnicos, comunitarios y territoriales.",
pregunta:"¿Se integran diferentes formas de conocimiento?",
indicadores:[
"Academia",
"Comunidades",
"Saberes locales",
"Cartografía social",
"Diálogo de saberes"
]
}

];

/*=========================================================
INICIALIZACIÓN
=========================================================*/

document.addEventListener("DOMContentLoaded", iniciar);

function iniciar(){

    crearFormulario();
    iniciarCriterios();

    document
        .getElementById("calculateButton")
        .addEventListener("click",calcularMEBRI);

    iniciarControlAlcance();

}

/*=========================================================
GENERAR FORMULARIO
=========================================================*/

function crearFormulario(){

const contenedor =
document.getElementById("propertiesContainer");

contenedor.innerHTML="";

PROPERTIES.forEach((prop,index)=>{

const tarjeta=document.createElement("div");

tarjeta.className="property";

tarjeta.innerHTML=`

<h3>${index+1}. ${prop.nombre}</h3>

<p class="definition">

${prop.definicion}

</p>

<div class="question">

<strong>Pregunta orientadora</strong>

<br><br>

${prop.pregunta}

</div>

<div class="indicators">

<strong>Indicadores observables</strong>

<ul>

${prop.indicadores.map(i=>`<li>${i}</li>`).join("")}

</ul>

</div>

<div class="score">

<label>

Puntaje

</label>

<select id="score_${index}">

<option value="1">1 - Muy Bajo</option>

<option value="2">2 - Bajo</option>

<option value="3" selected>3 - Medio</option>

<option value="4">4 - Alto</option>

<option value="5">5 - Muy Alto</option>

</select>

</div>

<div class="criteria">

<strong>Criterios observables</strong>

${prop.indicadores.map(ind=>`

<label class="criterio">

<input
type="checkbox"
class="criterioCheck"
data-property="${index}">

<span>${ind}</span>

</label>

`).join("")}

</div>

<label>

Comentarios

</label>

<textarea
id="comment_${index}"
placeholder="Observaciones del evaluador"></textarea>

`;

contenedor.appendChild(tarjeta);

});

}
/*=========================================================
 MOTOR DE CÁLCULO MEBRI
=========================================================*/

function calcularMEBRI(){

    const datos = obtenerDatosFormulario();

    if(!datos){
        return;
    }

    // guardarEvaluacion(datos);

    const resultado = procesarResultados(datos);

    mostrarResultados(resultado);

}


/*=========================================================
 OBTENER DATOS DEL FORMULARIO
=========================================================*/

function obtenerDatosFormulario(){

    const sistema = {

        nombre:document.getElementById("systemName").value.trim(),

        pais:document.getElementById("country").value.trim(),

        evaluador:document.getElementById("evaluator").value.trim(),

        fecha:document.getElementById("date").value,

        modo:document.getElementById("modoEvaluacion").value,

        nivel:document.getElementById("nivel").value,

        sector:document.getElementById("sector").value

    };


    if(sistema.nombre===""){

        alert("Ingrese el nombre del sistema evaluado.");

        return null;

    }


    const propiedades=[];

    PROPERTIES.forEach((prop,index)=>{

        propiedades.push({

            nombre:prop.nombre,

            puntaje:Number(

                document.getElementById("score_"+index).value

            ),

            comentario:

                document.getElementById("comment_"+index).value.trim()

        });

    });


    return{

        sistema,

        propiedades

    };

}
/*=========================================================
FENOTIPOS INSTITUCIONALES
=========================================================*/

const FENOTIPOS = [

{
nombre:"Fragmentado",
perfil:[1,1,1,1,1,1,1,1,1],
descripcion:"Predomina la desarticulación institucional."
},

{
nombre:"Centralizado",
perfil:[3,2,2,2,2,2,1,1,2],
descripcion:"Alta dependencia de un actor central."
},

{
nombre:"Jerárquico",
perfil:[3,3,2,2,2,2,2,1,2],
descripcion:"Las decisiones dependen de la cadena de mando."
},

{
nombre:"Reactivo",
perfil:[3,3,3,2,2,2,2,2,2],
descripcion:"El sistema responde después de la perturbación."
},

{
nombre:"Robusto",
perfil:[3,3,3,3,2,5,3,2,3],
descripcion:"Resiste perturbaciones pero cambia poco."
},

{
nombre:"Adaptativo",
perfil:[4,4,4,5,5,3,4,4,4],
descripcion:"Aprende continuamente y modifica su comportamiento."
},

{
nombre:"Colaborativo",
perfil:[4,5,5,4,4,3,3,4,4],
descripcion:"La cooperación constituye el principal mecanismo de resiliencia."
},

{
nombre:"Resiliente",
perfil:[4,4,4,4,4,4,4,4,4],
descripcion:"Mantiene sus funciones esenciales frente a perturbaciones."
},

{
nombre:"Regenerativo",
perfil:[5,5,5,5,5,5,4,5,5],
descripcion:"Sale fortalecido después de las crisis."
},

{
nombre:"Biomimético",
perfil:[5,5,5,5,5,5,5,5,5],
descripcion:"Opera siguiendo principios inspirados en sistemas vivos."
},

{
nombre:"Ecosistémico",
perfil:[5,5,5,5,5,5,5,5,5],
descripcion:"Máxima integración multinivel y multisectorial."
}

];


/*=========================================================
 PROCESAMIENTO
=========================================================*/

function procesarResultados(datos){

    let suma=0;

    datos.propiedades.forEach(p=>{

        suma+=p.puntaje;

    });

    const promedio=suma/datos.propiedades.length;

    const indice=((promedio-1)/4)*100;

    let interpretacion="";

    if(promedio<=2){

        interpretacion="RESILIENCIA INSTITUCIONAL BAJA";

    }

    else if(promedio<=3.5){

        interpretacion="RESILIENCIA INSTITUCIONAL MEDIA";

    }

    else{

        interpretacion="RESILIENCIA INSTITUCIONAL ALTA";

    }
const fenotipo = calcularFenotipo(datos.propiedades);

return{

    promedio,

    indice,

    interpretacion,

    fenotipo,

    propiedades:datos.propiedades,

    sistema:datos.sistema

};

}


/*=========================================================
 MOSTRAR RESULTADOS
=========================================================*/

function mostrarResultados(resultado){

    const contenedor=

        document.getElementById("resultsContainer");


    let html="";


    html+=`

    <div class="resultBox">

        <div class="resultNumber">

            ${resultado.promedio.toFixed(2)}
            </div>
            <div
style="
margin-top:20px;
padding:20px;
background:#EEF5F7;
border-radius:10px;
">

<h2>

Fenotipo Institucional

</h2>

<h1>

${resultado.fenotipo.nombre}

</h1>

<p>

${resultado.fenotipo.descripcion}

</p>

<p>

Distancia fenotípica:
<strong>

${resultado.fenotipo.distancia.toFixed(2)}

</strong>

</p>

</div>

        </div>

        <div class="resultTitle">

            ${resultado.interpretacion}

        </div>

        <div class="summary">

            <div>

                <strong>Índice Biomimético</strong>

                <br>

                ${resultado.promedio.toFixed(2)} / 5

            </div>

            <div>

                <strong>Índice Normalizado</strong>

                <br>

                ${resultado.indice.toFixed(1)} /100

            </div>

            <div>

                <strong>Modo</strong>

                <br>

                ${resultado.sistema.modo}

            </div>

            ${resultado.sistema.modo === "nivel" ? `
<div>
    <strong>Nivel</strong>

    <br>

    ${resultado.sistema.nivel}
</div>
` : ""}

${resultado.sistema.modo === "sector" ? `
<div>
    <strong>Sector</strong>

    <br>

    ${resultado.sistema.sector}
</div>
` : ""}

${resultado.sistema.modo === "interseccion" ? `
<div>
    <strong>Nivel</strong>

    <br>

    ${resultado.sistema.nivel}
</div>

<div>
    <strong>Sector</strong>

    <br>

    ${resultado.sistema.sector}
</div>
` : ""}

        </div>

        <h3>

            Resultado por propiedad

        </h3>

        <table>

            <thead>

                <tr>

                    <th>Propiedad</th>

                    <th>Puntaje</th>

                    <th>Estado</th>

                </tr>

            </thead>

            <tbody>

                ${crearTabla(resultado.propiedades)}

            </tbody>

        </table>

        <div id="radarChart">

        </div>

    </div>

    `;

    contenedor.innerHTML=html;

}


/*=========================================================
 TABLA
=========================================================*/

function crearTabla(lista){

    let html="";

    lista.forEach(item=>{

        let estado="";

        if(item.puntaje==1){

            estado="🔴 Muy Bajo";

        }

        else if(item.puntaje==2){

            estado="🟠 Bajo";

        }

        else if(item.puntaje==3){

            estado="🟡 Medio";

        }

        else if(item.puntaje==4){

            estado="🟢 Alto";

        }

        else{

            estado="✅ Muy Alto";

        }

        html+=`

        <tr>

            <td>

                ${item.nombre}

            </td>

            <td>

                ${item.puntaje}

            </td>

            <td>

                ${estado}

            </td>

        </tr>

        `;

    });

    return html;

}
/*=========================================================
CLASIFICACIÓN DEL FENOTIPO
=========================================================*/

function calcularFenotipo(propiedades){

    let mejor = null;
    let menor = Number.MAX_VALUE;

    FENOTIPOS.forEach(fenotipo=>{

        let distancia = 0;

        for(let i=0;i<propiedades.length;i++){

            distancia += Math.pow(
                propiedades[i].puntaje - fenotipo.perfil[i],
                2
            );

        }

        distancia = Math.sqrt(distancia);

        if(distancia < menor){

            menor = distancia;
            mejor = fenotipo;

        }

    });

    return{

        nombre:mejor.nombre,
        descripcion:mejor.descripcion,
        distancia:menor

    };

}
/*=========================================
CONTROL DEL ALCANCE DE EVALUACIÓN
=========================================*/

function iniciarControlAlcance(){

    const modo = document.getElementById("modoEvaluacion");
    const nivel = document.getElementById("nivel");
    const sector = document.getElementById("sector");

    if(!modo || !nivel || !sector) return;

    function actualizarAlcance(){

        switch(modo.value){

            case "nivel":
                nivel.disabled = false;
                sector.disabled = true;
                sector.selectedIndex = 0;
                break;

            case "sector":
                nivel.disabled = true;
                nivel.selectedIndex = 0;
                sector.disabled = false;
                break;

            case "interseccion":
                nivel.disabled = false;
                sector.disabled = false;
                break;
          
            case "comparativo":
    nivel.disabled = true;
    sector.disabled = true;
    nivel.selectedIndex = 0;
    sector.selectedIndex = 0;
    break;

        }

}
/*=====================================================
CREAR CRITERIOS OBSERVABLES
=====================================================*/

function crearCriterios(clave){

    if(!CRITERIOS[clave]) return "";

    let html = "<div class='criterios'>";

    html += "<h4>Criterios observables</h4>";

    CRITERIOS[clave].forEach(texto=>{

        html += `
        <label class="criterio">
            <input type="checkbox">
            ${texto}
        </label>
        `;

    });

    html += `
        <label style="margin-top:15px;display:block;">
            Observaciones
        </label>

        <textarea
            rows="3"
            placeholder="Escriba aquí las observaciones del evaluador..."
        ></textarea>
    `;

    html += "</div>";

    return html;

}
/*=====================================================
ACTUALIZAR PUNTAJE DESDE LOS CRITERIOS
=====================================================*/

function iniciarCriterios(){

    const checks=document.querySelectorAll(".criterioCheck");

    checks.forEach(check=>{

        check.addEventListener("change",()=>{

            const propiedad=check.dataset.property;

            const grupo=document.querySelectorAll(
                `.criterioCheck[data-property="${propiedad}"]`
            );

            let marcados=0;

            grupo.forEach(c=>{

                if(c.checked) marcados++;

            });

            let puntaje=1;

            if(marcados==1) puntaje=2;

            if(marcados>=2 && marcados<=3) puntaje=3;

            if(marcados==4) puntaje=4;

            if(marcados==5) puntaje=5;

            document.getElementById(
                `score_${propiedad}`
            ).value=puntaje;

        });

    });

}
    actualizarComparacion();

}
