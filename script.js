function generarTabla() {
    const cantidadDatos = parseInt(document.getElementById('cantidadDatos').value);
    const tableBody = document.getElementById('dataInputTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = '';  // Limpiar las filas previas

    for (let i = 0; i < cantidadDatos; i++) {
        const row = tableBody.insertRow();

        // Celda para ingresar el año
        const cellYear = row.insertCell(0);
        const yearInput = document.createElement('input');
        yearInput.type = 'number';
        yearInput.className = 'yearInput';
        cellYear.appendChild(yearInput);

        // Celda para ingresar la población
        const cellPopulation = row.insertCell(1);
        const populationInput = document.createElement('input');
        populationInput.type = 'number';
        populationInput.className = 'populationInput';
        cellPopulation.appendChild(populationInput);
    }
}

function realizarCalculos() {
    const añoActual = parseInt(document.getElementById('añoActual').value);
    const years = Array.from(document.getElementsByClassName('yearInput')).map(input => parseInt(input.value));
    const populations = Array.from(document.getElementsByClassName('populationInput')).map(input => parseInt(input.value));

    const futureYears = [añoActual + 5, añoActual + 10, añoActual + 15, añoActual + 20, añoActual + 25];

    // Método Aritmético
    const aritmetico = calcularAritmetico(years, populations, futureYears);

    // Método Exponencial
    const exponencial = calcularExponencial(years, populations, futureYears);

    // Método Geométrico
    const geometrico = calcularGeometrico(years, populations, futureYears);

    // Calcular promedio total
    const promedioTotal = calcularPromedio(aritmetico, exponencial, geometrico);

    // Mostrar resultados
    mostrarResultados(futureYears, aritmetico, exponencial, geometrico, promedioTotal);
}

function calcularAritmetico(años, poblaciones, futuro) {
    const m = [];
    for (let i = 0; i < años.length - 1; i++) {
        m.push((poblaciones[poblaciones.length - 1] - poblaciones[i]) / (años[años.length - 1] - años[i]));
    }
    const promedio = m.reduce((a, b) => a + b, 0) / m.length;

    return futuro.map(futuroAño => poblaciones[poblaciones.length - 1] + promedio * (futuroAño - años[años.length - 1]));
}

function calcularExponencial(años, poblaciones, futuro) {
    const k = [];
    for (let i = 0; i < años.length - 1; i++) {
        k.push((Math.log(poblaciones[i + 1]) - Math.log(poblaciones[i])) / (años[i + 1] - años[i]));
    }
    const promExp = k.reduce((a, b) => a + b, 0) / k.length;

    return futuro.map(futuroAño => poblaciones[0] * Math.exp(promExp * (futuroAño - años[0])));
}

function calcularGeometrico(años, poblaciones, futuro) {
    const r = [];
    for (let i = 0; i < años.length - 1; i++) {
        r.push((((poblaciones[poblaciones.length - 1] / poblaciones[i]) ** (1 / (años[años.length - 1] - años[i]))) - 1));
    }

    const matrizResultados = r.map(ri => futuro.map(futuroAño => poblaciones[poblaciones.length - 1] * (1 + ri) ** (futuroAño - años[años.length - 1])));

    return futuro.map((_, col) => matrizResultados.reduce((sum, fila) => sum + fila[col], 0) / r.length);
}

function calcularPromedio(aritmetico, exponencial, geometrico) {
    return aritmetico.map((_, i) => (aritmetico[i] + exponencial[i] + geometrico[i]) / 3);
}

function mostrarResultados(futuro, aritmetico, exponencial, geometrico, promedioTotal) {
    const tbody = document.getElementById('resultados').querySelector('tbody');
    tbody.innerHTML = '';

    for (let i = 0; i < futuro.length; i++) {
        const row = `<tr>
            <td>${futuro[i]}</td>
            <td>${Math.round(aritmetico[i])}</td>
            <td>${Math.round(exponencial[i])}</td>
            <td>${Math.round(geometrico[i])}</td>
            <td>${Math.round(promedioTotal[i])}</td>
        </tr>`;
        tbody.innerHTML += row;
    }
}
