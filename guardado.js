window.onload = function() {
    // Recuperar los promedios almacenados en localStorage
    const proyecciones = JSON.parse(localStorage.getItem('proyecciones'));

    if (proyecciones && proyecciones.length > 0) {
        let resultadosDiv = document.getElementById("resultados");
        resultadosDiv.innerHTML = "<h2>Tabla de Años y Promedios</h2>";
        
        // Generar tabla con los promedios finales
        let tablaHTML = "<table><tr><th>Año</th><th>Promedio</th></tr>";
        proyecciones.forEach(proyeccion => {
            tablaHTML += `<tr><td>${proyeccion.año}</td><td>${proyeccion.promedio}</td></tr>`;
        });
        tablaHTML += "</table>";

        resultadosDiv.innerHTML += tablaHTML;
    } else {
        console.log("No se encontraron proyecciones almacenadas.");
        let resultadosDiv = document.getElementById("resultados");
        resultadosDiv.innerHTML = "<p>No se encontraron resultados guardados.</p>";
    }
};
