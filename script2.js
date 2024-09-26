document.addEventListener("DOMContentLoaded", function () {
    const promediosFinales = JSON.parse(localStorage.getItem('proyecciones'));
    if (promediosFinales) {
        const años = promediosFinales.map(item => item.año);
        const poblaciones = promediosFinales.map(item => item.promedio);

        let ip_ = [];
        let cp_ip = [];
        let dn = [];
        let dnt = [];
        let p_ = [];
        let dbruta = [];
        let db_adoptada = [];
        let Qmd = [];
        let QmdM = [];
        let cmH = [];

        // Obtener valores iniciales
        let dn0 = parseFloat(prompt(`Ingrese el primer valor de dn (dotación corregida) en el año cero (${años[0]}):`));
        let t0 = parseFloat(prompt("Ingrese la temperatura en °C: "));

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
        if (t0 > 28) {
            let t1 = parseFloat(prompt("Se debe corregir la dotación corregida en un 15 a 20%, ingrese el porcentaje (ej: 0.15 o 0.20):"));
            for (let i = 0; i < dn.length; i++) {
                let resultado = (t1 * dn[i]) + dn[i];
                dnt.push(parseFloat(resultado));
            }
        } else if (t0 >= 20 && t0 <= 28) {
            let t1 = parseFloat(prompt("Se debe corregir la dotación corregida en un 10 a 15%, ingrese el porcentaje (ej: 0.10 o 0.15):"));
            for (let i = 0; i < dn.length; i++) {
                let resultado = (t1 * dn[i]) + dn[i];
                dnt.push(parseFloat(resultado));
            }
        } else {
            dnt = [...dn];  // Si la temperatura es menor a 20°C, no se hace corrección
        }

        // Pérdidas técnicas
        let pp = parseFloat(prompt("Ingrese el porcentaje de pérdidas técnicas inicial (30 a 20%):"));
        let pf = parseFloat(prompt("Ingrese el porcentaje de pérdidas finales (10 o 15%):"));

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

        // Imprimir tabla de resultados
        const tablaDiv = document.getElementById("resultados-paso2");
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
        tablaHtml += `</table>`;
        tablaDiv.innerHTML = tablaHtml;
    } else {
        alert("No hay datos guardados para mostrar.");
    }
});