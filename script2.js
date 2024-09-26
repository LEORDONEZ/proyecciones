document.addEventListener("DOMContentLoaded", function () {
    const promediosFinales = JSON.parse(localStorage.getItem('proyecciones'));

    if (promediosFinales) {
        const años = promediosFinales.map(item => item.año);
        const poblaciones = promediosFinales.map(item => item.promedio);

        // Variables globales para almacenar los valores de los 3 pasos
        let dn0, t0, pp, pf, t1, dn = [], dnt = [], ip_ = [], cp_ip = [], p_ = [], dbruta = [], db_adoptada = [], Qmd = [], QmdM = [], cmH = [];

        // Crear un formulario dinámico para ingresar datos del Paso 1
        const formularioDiv = document.createElement('div');
        formularioDiv.innerHTML = `
            <form id="paso1Form">
                <h2>Paso 1: Ingresar los Datos Iniciales</h2>
                <label for="dn0">Primer valor de dn (dotación corregida) en el año cero:</label>
                <input type="number" id="dn0" step="any" required><br><br>

                <label for="temp">Temperatura en °C:</label>
                <input type="number" id="temp" step="any" required><br><br>

                <label for="perdidaInicial">Porcentaje de pérdidas inicial 30% a 20%:</label>
                <input type="number" id="perdidaInicial" step="any" required><br><br>

                <label for="perdidaFinal">Porcentaje de pérdidas finales [10 a 15%]:</label>
                <input type="number" id="perdidaFinal" step="any" required><br><br>

                <button type="submit">Siguiente</button>
            </form>
        `;

        // Insertar el formulario antes de la tabla de resultados
        const resultadosDiv = document.getElementById('resultados-paso2');
        resultadosDiv.parentNode.insertBefore(formularioDiv, resultadosDiv);

        // Paso 1: Capturar los datos iniciales
        document.getElementById('paso1Form').addEventListener('submit', function (e) {
            e.preventDefault();

            dn0 = parseFloat(document.getElementById('dn0').value);
            t0 = parseFloat(document.getElementById('temp').value);
            pp = parseFloat(document.getElementById('perdidaInicial').value);
            pf = parseFloat(document.getElementById('perdidaFinal').value);

            // Una vez se han capturado los datos del Paso 1, mostramos el Paso 2
            formularioDiv.innerHTML = `
                <form id="paso2Form">
                    <h2>Paso 2: Corregir la Dotación por Temperatura</h2>
                    ${t0 > 28 ? `
                        <label for="t1">Ingrese el porcentaje de corrección (ej: 0.15 o 0.20):</label>
                    ` : t0 >= 20 && t0 <= 28 ? `
                        <label for="t1">Ingrese el porcentaje de corrección (ej: 0.10 o 0.15):</label>
                    ` : `
                        <p>No se requiere corrección por temperatura.</p>
                    `}
                    ${t0 >= 20 ? `<input type="number" id="t1" step="any" required><br><br>` : ''}
                    <button type="submit">Calcular</button>
                </form>
            `;

            // Paso 2: Capturar la corrección por temperatura y calcular
            document.getElementById('paso2Form').addEventListener('submit', function (e) {
                e.preventDefault();

                // Si se requiere corrección por temperatura
                if (t0 >= 20) {
                    t1 = parseFloat(document.getElementById('t1').value);
                }

                // Cálculo de los valores y generación de la tabla
                calcularResultados();

                // Paso 3: Mostrar la tabla
                mostrarResultados();
            });
        });

        function calcularResultados() {
            // Calcular ip_ (porcentajes de incremento entre años consecutivos)
            for (let i = 0; i < poblaciones.length - 1; i++) {
                let resultado = ((poblaciones[i + 1] - poblaciones[i]) * 100 / poblaciones[i]).toFixed(2);
                ip_.push(parseFloat(resultado));
            }

            // Calcular cp_ip (crecimiento por cada año)
            for (let i = 0; i < ip_.length; i++) {
                let resultado = (ip_[i] / 10).toFixed(2);
                cp_ip.push(parseFloat(resultado));
            }

            // Calcular dn (dotación corregida en cada año)
            dn.push(dn0);  // El primer valor de dn es dn0
            for (let i = 0; i < cp_ip.length; i++) {
                let resultado = (dn[i] * ((cp_ip[i] / 100) + 1)).toFixed(0);
                dn.push(parseFloat(resultado));
            }

            // Corregir dotación por temperatura
            if (t1) {
                for (let i = 0; i < dn.length; i++) {
                    let resultado = (t1 * dn[i]) + dn[i];
                    dnt.push(parseFloat(resultado));
                }
            } else {
                dnt = [...dn];  // Si no hay corrección por temperatura
            }

            // Pérdidas técnicas
            for (let i = 0; i < dnt.length; i++) {
                if (i === 0) {
                    p_.push(pp);
                } else {
                    let decremento = (pp - pf) / (dnt.length - 1);
                    p_.push((p_[i - 1] - decremento).toFixed(2));
                }
            }

            // Dotación bruta
            for (let i = 0; i < dnt.length; i++) {
                let resultado = (dnt[i] / (1 - (p_[i] / 100))).toFixed(0);
                dbruta.push(parseFloat(resultado));
            }

            // Aproximar a múltiplos de 5 (dotación bruta adoptada)
            function aproximarMultiplos5(num) {
                return Math.round(num / 5) * 5;
            }
            db_adoptada = dbruta.map(aproximarMultiplos5);

            // Calcular caudales
            for (let i = 0; i < poblaciones.length; i++) {
                let resultado = (db_adoptada[i] * poblaciones[i] / 86400).toFixed(2);
                Qmd.push(parseFloat(resultado));
            }

            // Calcular QMD y CMH
            for (let i = 0; i < Qmd.length; i++) {
                let k1, k2;
                if (poblaciones[i] <= 12500) {
                    k1 = 1.3;
                    k2 = 1.6;
                } else {
                    k1 = 1.2;
                    k2 = 1.5;
                }
                let resultadoQmdM = (Qmd[i] * k1).toFixed(2);
                let resultadoCmH = (Qmd[i] * k1 * k2).toFixed(2);
                QmdM.push(parseFloat(resultadoQmdM));
                cmH.push(parseFloat(resultadoCmH));
            }
        }

        function mostrarResultados() {
            // Generar la tabla de resultados
            let tablaHtml = `<table>
                <tr>
                    <th>Año</th><th>Población</th><th>Ip(%)</th><th>C.P(%)</th>
                    <th>dn [L/(hab-día)]</th><th>dnT [L/(hab-día)]</th><th>%P</th>
                    <th>dbruta [L/(hab-día)]</th><th>dbruta adoptada [L/(hab-día)]</th>
                    <th>Qmd [L/s]</th><th>QMD [L/s]</th><th>CMH [L/s]</th>
                </tr>`;
            for (let i = 0; i < poblaciones.length; i++) {
                tablaHtml += `<tr>
                    <td>${años[i]}</td><td>${poblaciones[i]}</td><td>${ip_[i] || ''}</td><td>${cp_ip[i] || ''}</td>
                    <td>${dn[i] || ''}</td><td>${dnt[i] || ''}</td><td>${p_[i] || ''}</td>
                    <td>${dbruta[i] || ''}</td><td>${db_adoptada[i] || ''}</td>
                    <td>${Qmd[i] || ''}</td><td>${QmdM[i] || ''}</td><td>${cmH[i] || ''}</td>
                </tr>`;
            }
            tablaHtml += '</table>';

            document.getElementById('resultados-paso2').innerHTML = tablaHtml;
        }
    }
});
