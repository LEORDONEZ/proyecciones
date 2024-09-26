function generarInputs() {
    const n = document.getElementById("cantidadDatos").value;
    const datosDiv = document.getElementById("datos");
    datosDiv.innerHTML = "";

    for (let i = 0; i < n; i++) {
        datosDiv.innerHTML += `
        <div class="input-row">
            <input type="number" id="año${i}" placeholder="Año ${i + 1}" required>
            <input type="number" id="poblacion${i}" placeholder="Población para el año ${i + 1}" required>
        </div>`;
    }
}

function calcularProyecciones() {
    const añoActual = parseInt(document.getElementById("añoActual").value);
    const n = parseInt(document.getElementById("cantidadDatos").value);
    const años = [];
    const poblaciones = [];
    const futuro = [añoActual, añoActual + 5, añoActual + 10, añoActual + 15, añoActual + 20, añoActual + 25];
  
    for (let i = 0; i < n; i++) {
        años.push(parseInt(document.getElementById(`año${i}`).value));
        poblaciones.push(parseInt(document.getElementById(`poblacion${i}`).value));
    }

    const ultimopoblacion = poblaciones[poblaciones.length - 1];
    const ultimoaño = años[años.length - 1];

    // Cálculo Método Aritmético
    const resultadospoblacion = poblaciones.slice(0, -1).map(p => ultimopoblacion - p);
    const resultadosaños = años.slice(0, -1).map(a => ultimoaño - a);
    const m = resultadospoblacion.map((rp, i) => rp / resultadosaños[i]);
    const promedioM = m.reduce((acc, val) => acc + val, 0) / m.length;

    const pfAritmetico = futuro.map(f => Math.round(ultimopoblacion + promedioM * (f - ultimoaño)));

    // Cálculo Método Exponencial
    const k = [];
    for (let i = 0; i < n - 1; i++) {
        k.push((Math.log(poblaciones[i + 1]) - Math.log(poblaciones[i])) / (años[i + 1] - años[i]));
    }
    const promK = k.reduce((acc, val) => acc + val, 0) / k.length;

    const pfExponencial = futuro.map(f => Math.round(poblaciones[0] * Math.exp(promK * (f - años[0]))));

    // Cálculo Método Geométrico
    const r = poblaciones.slice(0, -1).map((p, i) => ((ultimopoblacion / p) ** (1 / (ultimoaño - años[i]))) - 1);
    
    // Promedio de r
    const promR = r.reduce((acc, val) => acc + val, 0) / r.length;

    const pfGeometrico = futuro.map(f => {
        let sum = 0;
        for (let i = 0; i < r.length; i++) {
            sum += ultimopoblacion * Math.pow(1 + r[i], f - ultimoaño);
        }
        return Math.round(sum / r.length);
    });
    const promediosFinales = futuro.map((f, i) => {
        return {
            año: f,
            promedio: Math.round((pfGeometrico[i] + pfExponencial[i] + pfAritmetico[i]) / 3)
        };
    });
    localStorage.setItem('proyecciones', JSON.stringify(promediosFinales));




    // Mostrar los resultados en tablas
    let resultadosDiv = document.getElementById("resultados");
    resultadosDiv.innerHTML = "<h2>Resultados Método Aritmético</h2>";
    resultadosDiv.innerHTML += generarTabla(futuro, pfAritmetico, "Población Aritmética");

    resultadosDiv.innerHTML += "<h2>Resultados Método Exponencial</h2>";
    resultadosDiv.innerHTML += generarTabla(futuro, pfExponencial, "Población Exponencial");

    resultadosDiv.innerHTML += "<h2>Resultados Método Geométrico</h2>";
    resultadosDiv.innerHTML += generarTablaGeometrico(futuro, r, ultimopoblacion, ultimoaño);

    // Tabla General
    resultadosDiv.innerHTML += "<h2>Tabla General de Resultados</h2>";
    resultadosDiv.innerHTML += generarTablaGeneral(futuro, pfGeometrico, pfExponencial, pfAritmetico);
    // Mostrar el botón "Paso 2"
    document.getElementById("paso2-btn").style.display = "block";
}

function generarTabla(años, valores, titulo) {
    let html = `<table><tr><th>Año</th><th>${titulo}</th></tr>`;
    for (let i = 0; i < años.length; i++) {
        html += `<tr><td>${años[i]}</td><td>${valores[i]}</td></tr>`;
    }
    html += "</table>";
    return html;
}

function generarTablaGeometrico(añosFuturos, rValues, ultimopoblacion, ultimoaño) {
    let html = `<table><tr><th>Año</th>`;
    for (let i = 0; i < rValues.length; i++) {
        html += `<th>r${i + 1} = ${rValues[i].toFixed(4)}</th>`;
    }
    html += `<th>Promedio</th></tr>`;

    for (let i = 0; i < añosFuturos.length; i++) {
        html += `<tr><td>${añosFuturos[i]}</td>`;
        let sum = 0;
        for (let j = 0; j < rValues.length; j++) {
            const valor = Math.round(ultimopoblacion * Math.pow(1 + rValues[j], añosFuturos[i] - ultimoaño));
            sum += valor;
            html += `<td>${valor}</td>`;
        }
        const promedio = Math.round(sum / rValues.length);
        html += `<td><strong>${promedio}</strong></td></tr>`;
    }
    html += "</table>";
    return html;
}

function generarTablaGeneral(años, geometrico, exponencial, aritmetico) {
    let html = `<table>
    <tr>
        <th>Año</th>
        <th>Método Geométrico</th>
        <th>Método Exponencial</th>
        <th>Método Aritmético</th>
        <th>Promedio Total</th>
    </tr>`;
    for (let i = 0; i < años.length; i++) {
        const promedioTotal = Math.round((geometrico[i] + exponencial[i] + aritmetico[i]) / 3);
        html += `<tr>
            <td>${años[i]}</td>
            <td>${geometrico[i]}</td>
            <td>${exponencial[i]}</td>
            <td>${aritmetico[i]}</td>
            <td><strong>${promedioTotal}</strong></td>
        </tr>`;
    }
    html += "</table>";
    return html;
}

// Función para redirigir a paso2.html
function irPaso2() {
    window.location.href = "paso2.html";
}
