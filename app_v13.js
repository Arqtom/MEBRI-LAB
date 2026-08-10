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
ESTADO DE COMPARACIÓN SISTÉMICA
=========================================================*/

const COMPARACION = {
    unidadActual: null,
    resultadoA: null,
    resultadoB: null,
    nombreA: "",
    nombreB: ""
};


/*=========================================================
INICIALIZACIÓN
=========================================================*/

document.addEventListener("DOMContentLoaded", iniciar);

function iniciar(){

    crearFormulario();

    document
        .getElementById("calculateButton")
        .addEventListener("click",calcularMEBRI);

    iniciarControlAlcance();
    iniciarUnidadA();
    iniciarCheckboxCriterios();
    iniciarBotonResumenMEBRI();

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
tarjeta.dataset.propertyIndex = index;

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

<select id="score_${index}" class="property-score">

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
    resultadoIndividualMEBRI = null;
    limpiarResultadoVisualIndividual();
    ocultarRadarIndividual();
    ocultarRadarMEBRI();


    actualizarTodosLosPuntajesDesdeCheckbox();


    const datos = obtenerDatosFormulario();

    if(!datos){
        return;
    }

    // guardarEvaluacion(datos);

    const resultado = procesarResultados(datos);

    mostrarResultados(resultado);
    dibujarRadarIndividual(resultado);

    mostrarHerramientasResultado(resultado);

    if(datos.sistema.modo === "comparativo"){

        if(COMPARACION.unidadActual === "A"){

            COMPARACION.resultadoA = resultado;

            mostrarEstadoUnidadA(
                "Evaluación A completada. Resultado A guardado correctamente."
            );

            habilitarUnidadB();

        }

        if(COMPARACION.unidadActual === "B"){

            COMPARACION.resultadoB = resultado;

            mostrarEstadoUnidadB(
                "Evaluación B completada. Resultado B guardado correctamente."
            );

            mostrarComparacionSistemica();
            dibujarRadarMEBRI();
            radarCanvasForSummary=document.getElementById("radarCanvas");
            resultadoIndividualMEBRI = null;
            const botonResumenComparacion = document.getElementById("botonResumenMEBRI");
            if(botonResumenComparacion) botonResumenComparacion.style.display = "block";

        }

    }
    else{
        mostrarHerramientasResultado(resultado);
    }


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
/*=========================================================
CHECKBOX → PUNTAJE MEBRI
=========================================================*/

function iniciarCheckboxCriterios(){

    const contenedor =
        document.getElementById("propertiesContainer");

    if(!contenedor) return;

    contenedor.addEventListener("change", function(event){

        const check =
            event.target.closest(".criterio input[type='checkbox']");

        if(!check) return;

        check.dataset.touched = "1";

        const bloque =
            check.closest("[data-property-index]");

        if(!bloque) return;

        const checks =
            bloque.querySelectorAll(
                ".criterio input[type='checkbox']"
            );

        const input =
            bloque.querySelector(".property-score");

        if(!input || !checks.length) return;

        const marcados =
            Array.from(checks).filter(
                item => item.checked
            ).length;

        const puntaje =
            Math.max(1, Math.min(5, marcados));

        input.value = String(puntaje);

        input.dispatchEvent(
            new Event("change", {bubbles:true})
        );

    });

}


function actualizarTodosLosPuntajesDesdeCheckbox(){

    document
        .querySelectorAll("[data-property-index]")
        .forEach(function(bloque){

            const checks =
                bloque.querySelectorAll(
                    ".criterio input[type='checkbox']"
                );

            const input =
                bloque.querySelector(".property-score");

            if(!input || !checks.length) return;

            const huboInteraccion =
                Array.from(checks).some(
                    item => item.dataset.touched === "1"
                );

            if(!huboInteraccion) return;

            const marcados =
                Array.from(checks).filter(
                    item => item.checked
                ).length;

            /* El select usa exclusivamente valores 1–5.
               0 o 1 criterios marcados = 1;
               2 = 2; 3 = 3; 4 = 4; 5 = 5. */
            const puntaje =
                Math.max(1, Math.min(5, marcados));

            input.value = String(puntaje);

        });

}


/*=========================================================
CONTROL DE UNIDADES A Y B — COMPARACIÓN SISTÉMICA
=========================================================*/

function obtenerUnidadComparativa(tipo, letra){

    const id = tipo === "nivel"
        ? "nivel" + letra
        : "sector" + letra;

    const elemento = document.getElementById(id);

    return elemento ? elemento.value : "";
}


function actualizarEstadoUnidadA(){

    const tipo =
        document.getElementById("tipoComparacion");

    const seleccion =
        document.getElementById("unidadASeleccionada");

    const boton =
        document.getElementById("iniciarEvaluacionA");

    if(!tipo || !seleccion || !boton) return;

    const unidad = obtenerUnidadComparativa(
        tipo.value,
        "A"
    );

    if(unidad){

        seleccion.textContent =
            "Unidad A seleccionada: " + unidad;

        boton.disabled = false;

    }else{

        seleccion.textContent =
            "Seleccione la Unidad A y luego inicie su evaluación.";

        boton.disabled = true;

    }

}


function actualizarEstadoUnidadB(){

    const tipo =
        document.getElementById("tipoComparacion");

    const seleccion =
        document.getElementById("unidadBSeleccionada");

    const boton =
        document.getElementById("iniciarEvaluacionB");

    if(!tipo || !seleccion || !boton) return;

    const unidad = obtenerUnidadComparativa(
        tipo.value,
        "B"
    );

    if(unidad){

        seleccion.textContent =
            "Unidad B seleccionada: " + unidad;

        boton.disabled = false;

    }else{

        seleccion.textContent =
            "Complete primero la evaluación de la Unidad A.";

        boton.disabled = true;

    }

}


function iniciarUnidadA(){

    const modo =
        document.getElementById("modoEvaluacion");

    const tipo =
        document.getElementById("tipoComparacion");

    const botonA =
        document.getElementById("iniciarEvaluacionA");

    const botonB =
        document.getElementById("iniciarEvaluacionB");

    if(!modo || !tipo || !botonA) return;


    function iniciarA(){

        const unidad =
            obtenerUnidadComparativa(
                tipo.value,
                "A"
            );

        if(!unidad){

            alert(
                "Seleccione la Unidad A antes de iniciar la evaluación."
            );

            return;
        }


        COMPARACION.unidadActual = "A";
        COMPARACION.resultadoA = null;
        COMPARACION.resultadoB = null;
        COMPARACION.nombreA = unidad;
        COMPARACION.nombreB = "";


        const systemName =
            document.getElementById("systemName");

        if(systemName){

            systemName.value = unidad;

        }


        const estado =
            document.getElementById("estadoEvaluacionA");

        if(estado){

            estado.textContent =
                "Evaluando Unidad A: " +
                unidad +
                ". Complete el formulario MEBRI y presione Calcular MEBRI.";

        }


        ocultarUnidadB();
        ocultarComparacionSistemica();
        ocultarRadarMEBRI();
        ocultarRadarIndividual();


        const formulario =
            document.getElementById("propertiesContainer");

        if(formulario){

            formulario.scrollIntoView({
                behavior:"smooth",
                block:"start"
            });

        }

    }


    function iniciarB(){

        if(!COMPARACION.resultadoA){

            alert(
                "Primero debe completar y calcular la evaluación de la Unidad A."
            );

            return;

        }


        const unidad =
            obtenerUnidadComparativa(
                tipo.value,
                "B"
            );

        if(!unidad){

            alert(
                "Seleccione la Unidad B antes de iniciar la evaluación."
            );

            return;

        }


        COMPARACION.unidadActual = "B";
        COMPARACION.resultadoB = null;
        COMPARACION.nombreB = unidad;


        const systemName =
            document.getElementById("systemName");

        if(systemName){

            systemName.value = unidad;

        }


        /* Reiniciamos únicamente los campos de evaluación
           para evitar que las respuestas de A pasen a B. */

        document.querySelectorAll(
            ".property-score"
        ).forEach(function(input){

            input.value = "0";

        });


        document.querySelectorAll(
            ".criterio input[type='checkbox']"
        ).forEach(function(check){

            check.checked = false;
            delete check.dataset.touched;

        });

        document.querySelectorAll(
            ".property-score"
        ).forEach(function(input){

            input.value = "3";

        });


        const estado =
            document.getElementById("estadoEvaluacionB");

        if(estado){

            estado.textContent =
                "Evaluando Unidad B: " +
                unidad +
                ". Complete el formulario MEBRI y presione Calcular MEBRI.";

        }


        const formulario =
            document.getElementById("propertiesContainer");

        if(formulario){

            formulario.scrollIntoView({
                behavior:"smooth",
                block:"start"
            });

        }

    }


    botonA.addEventListener(
        "click",
        iniciarA
    );


    if(botonB){

        botonB.addEventListener(
            "click",
            iniciarB
        );

    }


    const sectorA =
        document.getElementById("sectorA");

    const nivelA =
        document.getElementById("nivelA");

    const sectorB =
        document.getElementById("sectorB");

    const nivelB =
        document.getElementById("nivelB");


    [sectorA, nivelA].forEach(function(elemento){

        if(elemento){

            elemento.addEventListener(
                "change",
                actualizarEstadoUnidadA
            );

        }

    });


    [sectorB, nivelB].forEach(function(elemento){

        if(elemento){

            elemento.addEventListener(
                "change",
                actualizarEstadoUnidadB
            );

        }

    });


    tipo.addEventListener(
        "change",
        function(){

            COMPARACION.unidadActual = null;
            COMPARACION.resultadoA = null;
            COMPARACION.resultadoB = null;

            ocultarUnidadB();
            ocultarComparacionSistemica();
        ocultarRadarMEBRI();
        ocultarRadarIndividual();

            actualizarEstadoUnidadA();

        }
    );


    modo.addEventListener(
        "change",
        function(){

            if(modo.value !== "comparativo"){

                COMPARACION.unidadActual = null;
                COMPARACION.resultadoA = null;
                COMPARACION.resultadoB = null;

                ocultarUnidadB();

            }

            actualizarEstadoUnidadA();

        }
    );


    actualizarEstadoUnidadA();

}


function habilitarUnidadB(){

    const contenedor =
        document.getElementById("unidadBControl");

    if(contenedor){

        contenedor.style.display = "block";

    }

    actualizarEstadoUnidadB();

}


function ocultarUnidadB(){

    const contenedor =
        document.getElementById("unidadBControl");

    if(contenedor){

        contenedor.style.display = "none";

    }

}


function mostrarEstadoUnidadA(mensaje){

    const estado =
        document.getElementById("estadoEvaluacionA");

    if(estado){

        estado.textContent = mensaje;

    }

}


function mostrarEstadoUnidadB(mensaje){

    const estado =
        document.getElementById("estadoEvaluacionB");

    if(estado){

        estado.textContent = mensaje;

    }

}


let resultadoIndividualMEBRI = null;
let radarCanvasForSummary = null;

/*=========================================================
RADAR INDIVIDUAL + RESUMEN IMPRIMIBLE
=========================================================*/

function obtenerResultadoIndividual(){
    return resultadoIndividualMEBRI || null;
}


function dibujarRadarEnCanvas(canvas, resultados, nombresSeries){
    if(!canvas || !canvas.getContext) return;
    const ctx=canvas.getContext("2d"); if(!ctx) return;
    const w=canvas.width||760,h=canvas.height||620,cx=w/2,cy=h/2+15,radius=Math.min(w,h)*0.34,n=PROPERTIES.length;
    const nombres=PROPERTIES.map(p=>p.nombre); ctx.clearRect(0,0,w,h);
    function point(i,value){const a=-Math.PI/2+i*2*Math.PI/n,r=radius*(Math.max(0,Math.min(5,Number(value)||0))/5);return{x:cx+r*Math.cos(a),y:cy+r*Math.sin(a)}}
    for(let level=1;level<=5;level++){ctx.beginPath();for(let i=0;i<n;i++){const p=point(i,level);if(i===0)ctx.moveTo(p.x,p.y);else ctx.lineTo(p.x,p.y)}ctx.closePath();ctx.strokeStyle="#d9e0e4";ctx.lineWidth=1;ctx.stroke()}
    for(let i=0;i<n;i++){const p=point(i,5);ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(p.x,p.y);ctx.strokeStyle="#d9e0e4";ctx.stroke()}
    const styles=[{fill:"rgba(54,122,178,.18)",line:"#367ab2"},{fill:"rgba(198,128,52,.18)",line:"#c68034"}];
    resultados.forEach((vals,si)=>{const st=styles[si%2];ctx.beginPath();vals.forEach((v,i)=>{const p=point(i,v);if(i===0)ctx.moveTo(p.x,p.y);else ctx.lineTo(p.x,p.y)});ctx.closePath();ctx.fillStyle=st.fill;ctx.strokeStyle=st.line;ctx.lineWidth=3;ctx.fill();ctx.stroke();vals.forEach((v,i)=>{const p=point(i,v);ctx.beginPath();ctx.arc(p.x,p.y,4,0,Math.PI*2);ctx.fillStyle=st.line;ctx.fill()})});
    ctx.font="14px Arial";ctx.textBaseline="middle";nombres.forEach((name,i)=>{const p=point(i,5.48),a=-Math.PI/2+i*2*Math.PI/n,c=Math.cos(a);ctx.textAlign=c>.25?"left":c<-.25?"right":"center";ctx.fillStyle="#263238";ctx.fillText(name,p.x,p.y)});
    if(resultados.length>1){const y=h-28,labels=nombresSeries||["Unidad A","Unidad B"];ctx.font="bold 14px Arial";ctx.textAlign="left";ctx.fillStyle="#367ab2";ctx.fillRect(cx-150,y-8,16,16);ctx.fillStyle="#263238";ctx.fillText(labels[0],cx-128,y);ctx.fillStyle="#c68034";ctx.fillRect(cx+20,y-8,16,16);ctx.fillStyle="#263238";ctx.fillText(labels[1],cx+42,y)}
}
function valoresDeResultado(resultado){return PROPERTIES.map((p,i)=>Math.max(0,Math.min(5,Number(obtenerValorPropiedad(resultado,p.nombre,i))||0)))}
function montarResultadoIndividualVisible(resultado){
    const results=document.getElementById("resultsContainer"); if(!results||!resultado)return;
    const old=document.getElementById("resultadoVisualIndividual");if(old)old.remove();
    const bloque=document.createElement("div");bloque.id="resultadoVisualIndividual";bloque.style.cssText="margin-top:24px;padding:18px;border:1px solid #d8e1e5;border-radius:10px;background:#fff";
    bloque.innerHTML=`<h3>Perfil biomimético MEBRI</h3><p style="margin-top:0">Representación gráfica de las nueve propiedades evaluadas.</p><div style="width:100%;max-width:760px;margin:0 auto"><canvas id="radarResultadoIndividual" width="760" height="620" style="width:100%;height:auto;display:block"></canvas></div><div style="margin-top:18px"><button type="button" id="resumenResultadoIndividual" style="padding:11px 18px;border:0;border-radius:8px;cursor:pointer;font-weight:600">Generar resumen / Imprimir PDF</button><small style="display:block;margin-top:6px">Se abrirá un informe listo para imprimir o guardar como PDF.</small></div>`;
    results.appendChild(bloque);const canvas=document.getElementById("radarResultadoIndividual");radarCanvasForSummary=canvas;dibujarRadarEnCanvas(canvas,[valoresDeResultado(resultado)],["Evaluación"]);
    const boton=document.getElementById("resumenResultadoIndividual");if(boton)boton.addEventListener("click",generarResumenMEBRI);
}
function limpiarResultadoVisualIndividual(){const el=document.getElementById("resultadoVisualIndividual");if(el)el.remove();radarCanvasForSummary=null}

function dibujarRadarIndividual(resultado){
    ocultarRadarMEBRI();

    if(!resultado) return;

    const canvas =
        document.getElementById("radarIndividualCanvas");

    const contenedor =
        document.getElementById("radarIndividual");

    if(!canvas || !contenedor) return;

    const valores =
        PROPERTIES.map(function(propiedad, index){

            return Math.max(
                0,
                Math.min(
                    5,
                    Number(
                        obtenerValorPropiedad(
                            resultado,
                            propiedad.nombre,
                            index
                        )
                    ) || 0
                )
            );

        });

    const nombres =
        PROPERTIES.map(
            propiedad => propiedad.nombre
        );

    const ctx = canvas.getContext("2d");
    if(!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2 + 15;
    const radius = Math.min(w, h) * 0.34;
    const n = nombres.length;

    ctx.clearRect(0, 0, w, h);

    function point(i, value){

        const angle =
            -Math.PI / 2 +
            i * 2 * Math.PI / n;

        const r =
            radius * (value / 5);

        return {
            x: cx + r * Math.cos(angle),
            y: cy + r * Math.sin(angle)
        };

    }

    for(let level = 1; level <= 5; level++){

        ctx.beginPath();

        for(let i = 0; i < n; i++){

            const p = point(i, level);

            if(i === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);

        }

        ctx.closePath();
        ctx.strokeStyle = "#d9e0e4";
        ctx.lineWidth = 1;
        ctx.stroke();

    }

    for(let i = 0; i < n; i++){

        const p = point(i, 5);

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = "#d9e0e4";
        ctx.lineWidth = 1;
        ctx.stroke();

    }

    ctx.beginPath();

    valores.forEach(function(value, i){

        const p = point(i, value);

        if(i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);

    });

    ctx.closePath();
    ctx.fillStyle = "rgba(54, 122, 178, 0.18)";
    ctx.strokeStyle = "#367ab2";
    ctx.lineWidth = 3;
    ctx.fill();
    ctx.stroke();

    valores.forEach(function(value, i){

        const p = point(i, value);

        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = "#367ab2";
        ctx.fill();

    });

    ctx.font = "14px Arial";
    ctx.textBaseline = "middle";

    nombres.forEach(function(name, i){

        const p = point(i, 5.48);
        const angle =
            -Math.PI / 2 +
            i * 2 * Math.PI / n;

        const c = Math.cos(angle);

        ctx.textAlign =
            c > 0.25 ? "left" :
            c < -0.25 ? "right" :
            "center";

        ctx.fillStyle = "#263238";
        ctx.fillText(name, p.x, p.y);

    });

    contenedor.style.display = "block";

}


function ocultarRadarIndividual(){

    const contenedor =
        document.getElementById("radarIndividual");

    if(contenedor){
        contenedor.style.display = "none";
    }

}


function obtenerIndiceResultado(resultado){

    if(!resultado) return 0;

    const candidatos = [
        resultado.indiceMEBRI,
        resultado.indice,
        resultado.puntajeFinal,
        resultado.puntaje,
        resultado.promedio,
        resultado.total
    ];

    const value =
        candidatos.find(
            x => typeof x === "number"
        );

    return typeof value === "number" ? value : 0;

}


function obtenerDatosSistemaParaResumen(){

    const datos = {};

    [
        "systemName",
        "country",
        "evaluator",
        "evaluationDate",
        "modoEvaluacion",
        "tipoComparacion",
        "sector",
        "nivel",
        "sectorA",
        "sectorB",
        "nivelA",
        "nivelB"
    ].forEach(function(id){

        const el = document.getElementById(id);

        if(el){
            datos[id] = el.value || "";
        }

    });

    return datos;

}


function generarResumenMEBRI(){

    const resultado =
        (typeof COMPARACION !== "undefined" &&
         COMPARACION.resultadoA &&
         COMPARACION.resultadoB)
            ? COMPARACION.resultadoB
            : obtenerResultadoIndividual();

    const datos =
        obtenerDatosSistemaParaResumen();

    const propiedades =
        PROPERTIES.map(function(propiedad, index){

            const valor =
                resultado
                    ? obtenerValorPropiedad(
                        resultado,
                        propiedad.nombre,
                        index
                    )
                    : 0;

            return {
                nombre: propiedad.nombre,
                valor: Number(valor) || 0
            };

        });

    const indice =
        resultado
            ? obtenerIndiceResultado(resultado)
            : 0;

    const radarCanvas =
        radarCanvasForSummary || document.getElementById("radarIndividualCanvas");

    const radarData =
        radarCanvas
            ? radarCanvas.toDataURL("image/png")
            : "";

    let filas =
        propiedades.map(function(p){

            return `
                <tr>
                    <td>${escapeResumen(p.nombre)}</td>
                    <td>${p.valor.toFixed(2)}</td>
                </tr>
            `;

        }).join("");

    let comparativo = "";

    if(
        COMPARACION &&
        COMPARACION.resultadoA &&
        COMPARACION.resultadoB
    ){

        const a =
            obtenerIndiceResultado(
                COMPARACION.resultadoA
            );

        const b =
            obtenerIndiceResultado(
                COMPARACION.resultadoB
            );

        comparativo = `
            <section>
                <h2>Comparación sistémica</h2>
                <p>
                    <strong>${escapeResumen(COMPARACION.nombreA)}</strong>:
                    ${a.toFixed(2)}
                </p>
                <p>
                    <strong>${escapeResumen(COMPARACION.nombreB)}</strong>:
                    ${b.toFixed(2)}
                </p>
                <p>
                    <strong>Diferencia A - B:</strong>
                    ${(a - b).toFixed(2)}
                </p>
            </section>
        `;

    }

    const radarImage =
        radarData
            ? `<img src="${radarData}" alt="Perfil MEBRI" class="radar-print">`
            : "";

    const ventana =
        window.open(
            "",
            "_blank",
            "width=900,height=800"
        );

    if(!ventana){

        alert(
            "El navegador bloqueó la ventana del resumen. Permita las ventanas emergentes para este sitio."
        );

        return;

    }

    ventana.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Resumen MEBRI</title>
            <style>
                body{
                    font-family:Arial,sans-serif;
                    margin:40px;
                    color:#263238;
                }
                h1,h2{
                    margin-bottom:8px;
                }
                .meta{
                    display:grid;
                    grid-template-columns:1fr 1fr;
                    gap:8px 24px;
                    margin-bottom:24px;
                }
                table{
                    width:100%;
                    border-collapse:collapse;
                    margin-top:16px;
                }
                th,td{
                    border:1px solid #ccd5d9;
                    padding:8px;
                    text-align:left;
                }
                th{
                    background:#f1f4f5;
                }
                .indice{
                    font-size:24px;
                    font-weight:bold;
                    margin:18px 0;
                }
                .radar-print{
                    display:block;
                    width:700px;
                    max-width:100%;
                    margin:20px auto;
                }
                @media print{
                    body{margin:20mm;}
                    button{display:none;}
                    .page-break{page-break-before:always;}
                }
            </style>
        </head>
        <body>

            <h1>Resumen de Evaluación MEBRI</h1>

            <div class="meta">
                ${Object.entries(datos).map(function(entry){

                    return `
                        <div>
                            <strong>${escapeResumen(entry[0])}:</strong>
                            ${escapeResumen(entry[1]) || "No especificado"}
                        </div>
                    `;

                }).join("")}
            </div>

            <div class="indice">
                Índice MEBRI: ${indice.toFixed(2)}
            </div>

            <h2>Perfil biomimético</h2>

            ${radarImage}

            <h2>Resultados por propiedad</h2>

            <table>
                <thead>
                    <tr>
                        <th>Propiedad MEBRI</th>
                        <th>Puntaje</th>
                    </tr>
                </thead>
                <tbody>
                    ${filas}
                </tbody>
            </table>

            ${comparativo}

            <button onclick="window.print()">
                Imprimir / Guardar como PDF
            </button>

        </body>
        </html>
    `);

    ventana.document.close();

    ventana.focus();

}


function escapeResumen(value){

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}



function mostrarHerramientasResultado(resultado){
    if(!resultado) return;
    resultadoIndividualMEBRI=resultado;
    ocultarRadarMEBRI();
    montarResultadoIndividualVisible(resultado);
    const boton=document.getElementById("botonResumenMEBRI");
    if(boton) boton.style.display="none";
}

function iniciarBotonResumenMEBRI(){

    const boton =
        document.getElementById("generarResumenMEBRI");

    const contenedor =
        document.getElementById("botonResumenMEBRI");

    if(!boton || !contenedor) return;

    boton.addEventListener(
        "click",
        generarResumenMEBRI
    );

}

/*=========================================================
RADAR COMPARATIVO MEBRI
=========================================================*/

function obtenerValoresRadar(resultado){

    return PROPERTIES.map(function(propiedad, index){

        return Math.max(
            0,
            Math.min(
                5,
                Number(
                    obtenerValorPropiedad(
                        resultado,
                        propiedad.nombre,
                        index
                    )
                ) || 0
            )
        );

    });

}


function dibujarRadarMEBRI(){
    resultadoIndividualMEBRI = null;
    ocultarRadarIndividual();

    if(
        !COMPARACION.resultadoA ||
        !COMPARACION.resultadoB
    ){
        return;
    }

    const canvas =
        document.getElementById("radarCanvas");

    const contenedor =
        document.getElementById("radarComparacion");

    if(!canvas || !contenedor){
        return;
    }

    const ctx = canvas.getContext("2d");

    if(!ctx){
        return;
    }

    const valoresA =
        obtenerValoresRadar(
            COMPARACION.resultadoA
        );

    const valoresB =
        obtenerValoresRadar(
            COMPARACION.resultadoB
        );

    const nombres =
        PROPERTIES.map(
            propiedad => propiedad.nombre
        );

    const ancho = canvas.width;
    const alto = canvas.height;

    ctx.clearRect(0, 0, ancho, alto);

    const cx = ancho / 2;
    const cy = alto / 2 + 15;
    const radio = Math.min(ancho, alto) * 0.34;
    const cantidad = nombres.length;
    const maximo = 5;

    function punto(indice, valor){

        const angulo =
            -Math.PI / 2 +
            (indice * 2 * Math.PI / cantidad);

        const r =
            radio * (valor / maximo);

        return {
            x: cx + r * Math.cos(angulo),
            y: cy + r * Math.sin(angulo)
        };

    }

    /* Escala 1–5 */
    for(let nivel = 1; nivel <= maximo; nivel++){

        ctx.beginPath();

        for(let i = 0; i < cantidad; i++){

            const p =
                punto(i, nivel);

            if(i === 0){
                ctx.moveTo(p.x, p.y);
            }else{
                ctx.lineTo(p.x, p.y);
            }

        }

        ctx.closePath();
        ctx.strokeStyle = "#d9e0e4";
        ctx.lineWidth = 1;
        ctx.stroke();

    }

    /* Ejes */
    for(let i = 0; i < cantidad; i++){

        const p =
            punto(i, maximo);

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = "#d9e0e4";
        ctx.lineWidth = 1;
        ctx.stroke();

    }

    function dibujarSerie(valores, estilo){

        ctx.beginPath();

        valores.forEach(function(valor, indice){

            const p =
                punto(indice, valor);

            if(indice === 0){
                ctx.moveTo(p.x, p.y);
            }else{
                ctx.lineTo(p.x, p.y);
            }

        });

        ctx.closePath();

        ctx.fillStyle = estilo.relleno;
        ctx.strokeStyle = estilo.linea;
        ctx.lineWidth = 3;

        ctx.fill();
        ctx.stroke();

        valores.forEach(function(valor, indice){

            const p =
                punto(indice, valor);

            ctx.beginPath();
            ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
            ctx.fillStyle = estilo.linea;
            ctx.fill();

        });

    }

    dibujarSerie(valoresA, {
        relleno: "rgba(54, 122, 178, 0.16)",
        linea: "#367ab2"
    });

    dibujarSerie(valoresB, {
        relleno: "rgba(198, 128, 52, 0.16)",
        linea: "#c68034"
    });

    /* Etiquetas */
    ctx.font = "14px Arial";
    ctx.textBaseline = "middle";

    nombres.forEach(function(nombre, indice){

        const p =
            punto(indice, maximo + 0.48);

        const angulo =
            -Math.PI / 2 +
            (indice * 2 * Math.PI / cantidad);

        const coseno = Math.cos(angulo);

        if(coseno > 0.25){
            ctx.textAlign = "left";
        }else if(coseno < -0.25){
            ctx.textAlign = "right";
        }else{
            ctx.textAlign = "center";
        }

        ctx.fillStyle = "#263238";

        ctx.fillText(
            nombre,
            p.x,
            p.y
        );

    });

    /* Leyenda */
    const leyendaY = alto - 28;

    ctx.textAlign = "left";
    ctx.font = "bold 14px Arial";

    ctx.fillStyle = "#367ab2";
    ctx.fillRect(cx - 130, leyendaY - 8, 16, 16);

    ctx.fillStyle = "#263238";
    ctx.fillText(
        COMPARACION.nombreA || "Unidad A",
        cx - 108,
        leyendaY
    );

    ctx.fillStyle = "#c68034";
    ctx.fillRect(cx + 20, leyendaY - 8, 16, 16);

    ctx.fillStyle = "#263238";
    ctx.fillText(
        COMPARACION.nombreB || "Unidad B",
        cx + 42,
        leyendaY
    );

    contenedor.style.display = "block";

}


function ocultarRadarMEBRI(){

    const contenedor =
        document.getElementById("radarComparacion");

    if(contenedor){
        contenedor.style.display = "none";
    }

}

/*=========================================================
COMPARACIÓN MATEMÁTICA DE RESULTADOS A Y B
=========================================================*/

function obtenerPropiedadesResultado(resultado){

    if(!resultado) return [];

    if(Array.isArray(resultado)){
        return resultado;
    }

    if(Array.isArray(resultado.propiedades)){
        return resultado.propiedades;
    }

    if(Array.isArray(resultado.resultados)){
        return resultado.resultados;
    }

    if(resultado.propiedades && typeof resultado.propiedades === "object"){
        return resultado.propiedades;
    }

    if(resultado.resultados && typeof resultado.resultados === "object"){
        return resultado.resultados;
    }

    return [];
}


function obtenerValorPropiedad(resultado, nombre, indice){

    const propiedades =
        obtenerPropiedadesResultado(resultado);

    if(Array.isArray(propiedades)){

        const item =
            propiedades.find(function(p){

                return (
                    p &&
                    (
                        p.nombre === nombre ||
                        p.name === nombre ||
                        p.propiedad === nombre
                    )
                );

            });

        if(item){

            const candidatos = [
                item.promedio,
                item.puntaje,
                item.puntuacion,
                item.score,
                item.valor,
                item.total,
                item.resultado
            ];

            const valor =
                candidatos.find(
                    x => typeof x === "number"
                );

            if(typeof valor === "number"){
                return valor;
            }

        }

        return 0;
    }

    if(propiedades && typeof propiedades === "object"){

        const directo = propiedades[nombre];

        if(typeof directo === "number"){
            return directo;
        }

        if(directo && typeof directo === "object"){

            const candidatos = [
                directo.promedio,
                directo.puntaje,
                directo.puntuacion,
                directo.score,
                directo.valor,
                directo.total,
                directo.resultado
            ];

            const valor =
                candidatos.find(
                    x => typeof x === "number"
                );

            if(typeof valor === "number"){
                return valor;
            }

        }

        /* Compatibilidad por posición si el resultado usa
           nombres normalizados/índices. */
        const porIndice =
            propiedades[indice];

        if(typeof porIndice === "number"){
            return porIndice;
        }

    }

    return 0;
}


function obtenerIndiceMEBRI(resultado){

    if(!resultado) return 0;

    const candidatos = [
        resultado.indiceMEBRI,
        resultado.indice,
        resultado.puntajeFinal,
        resultado.puntaje,
        resultado.promedio,
        resultado.total
    ];

    const valor =
        candidatos.find(
            x => typeof x === "number"
        );

    if(typeof valor === "number"){
        return valor;
    }

    return 0;
}


function mostrarComparacionSistemica(){

    if(
        !COMPARACION.resultadoA ||
        !COMPARACION.resultadoB
    ){
        return;
    }


    const contenedor =
        document.getElementById("resultadoComparacion");

    const resumen =
        document.getElementById("resumenComparacion");

    const tabla =
        document.querySelector(
            "#tablaComparacion tbody"
        );


    if(!contenedor || !resumen || !tabla){
        return;
    }


    const indiceA = obtenerIndiceMEBRI(COMPARACION.resultadoA);


    const indiceB = obtenerIndiceMEBRI(COMPARACION.resultadoB);


    const diferencia =
        indiceA - indiceB;


    resumen.innerHTML = `
        <div style="
            display:grid;
            grid-template-columns:repeat(3,minmax(0,1fr));
            gap:12px;
        ">

            <div>
                <strong>${COMPARACION.nombreA}</strong><br>
                Índice MEBRI: ${indiceA.toFixed(2)}
            </div>

            <div>
                <strong>${COMPARACION.nombreB}</strong><br>
                Índice MEBRI: ${indiceB.toFixed(2)}
            </div>

            <div>
                <strong>Diferencia A - B</strong><br>
                ${diferencia.toFixed(2)}
            </div>

        </div>
    `;


    const nombres = PROPERTIES.map(
        propiedad => propiedad.nombre
    );


    tabla.innerHTML = "";


    nombres.forEach(function(nombre, index){

        const valorA =
            obtenerValorPropiedad(COMPARACION.resultadoA, nombre, index);

        const valorB =
            obtenerValorPropiedad(COMPARACION.resultadoB, nombre, index);

        const brecha =
            valorA - valorB;


        const fila =
            document.createElement("tr");


        fila.innerHTML = `
            <td style="padding:8px; border-top:1px solid #e5e7eb;">
                ${nombre}
            </td>

            <td style="text-align:center; padding:8px; border-top:1px solid #e5e7eb;">
                ${valorA.toFixed(2)}
            </td>

            <td style="text-align:center; padding:8px; border-top:1px solid #e5e7eb;">
                ${valorB.toFixed(2)}
            </td>

            <td style="text-align:center; padding:8px; border-top:1px solid #e5e7eb;">
                ${brecha.toFixed(2)}
            </td>
        `;


        tabla.appendChild(fila);

    });


    contenedor.style.display = "block";

    contenedor.scrollIntoView({
        behavior:"smooth",
        block:"start"
    });

}


function ocultarComparacionSistemica(){

    const contenedor =
        document.getElementById("resultadoComparacion");

    if(contenedor){

        contenedor.style.display = "none";

    }

}


/*=========================================
CONTROL DEL ALCANCE DE EVALUACIÓN
=========================================*/

function iniciarControlAlcance(){

    const modo = document.getElementById("modoEvaluacion");
    const nivel = document.getElementById("nivel");
    const sector = document.getElementById("sector");

    const comparacionContainer =
        document.getElementById("comparacionContainer");

    const tipoComparacion =
        document.getElementById("tipoComparacion");

    const comparacionSectores =
        document.getElementById("comparacionSectores");

    const comparacionNiveles =
        document.getElementById("comparacionNiveles");

    if(!modo || !nivel || !sector){
        return;
    }

    function actualizarTipoComparacion(){

        if(!tipoComparacion){
            return;
        }

        if(tipoComparacion.value === "nivel"){

            if(comparacionSectores){
                comparacionSectores.style.display = "none";
            }

            if(comparacionNiveles){
                comparacionNiveles.style.display = "block";
            }

        }else{

            if(comparacionSectores){
                comparacionSectores.style.display = "block";
            }

            if(comparacionNiveles){
                comparacionNiveles.style.display = "none";
            }

        }

    }

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


            default:

                nivel.disabled = false;
                sector.disabled = false;

                break;

        }

        if(comparacionContainer){

            comparacionContainer.style.display =
                modo.value === "comparativo"
                    ? "block"
                    : "none";

        }

        if(modo.value === "comparativo"){

            actualizarTipoComparacion();

        }

    }

    modo.addEventListener(
        "change",
        actualizarAlcance
    );

    if(tipoComparacion){

        tipoComparacion.addEventListener(
            "change",
            actualizarTipoComparacion
        );

    }

    actualizarAlcance();

}

