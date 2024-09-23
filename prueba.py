import math
años = [1985,1993,2005,2018]
poblacion = [631,793,1274,1666]
r = [0.0298575, 0.0301396, 0.0208501]
futuro = [2024,2029,2034,2039,2044,2049]
promedio_ = []


matriz_resultados = []

for j in range(len(r)):
    fila = []
    for i in range(len(futuro)):
        resultado = poblacion[-1]*(1+r[j])**(futuro[i]-años[-1])
        fila.append(round(resultado))
    matriz_resultados.append(fila)

for fila in matriz_resultados:
    print(fila)

# Calcular el promedio de cada columna
promedios_columnas = []
for col in range(len(futuro)):  # Recorrer cada columna
    suma_columna = 0
    for fila in matriz_resultados:  # Recorrer cada fila en esa columna
        suma_columna += fila[col]
    promedio = suma_columna / len(r)  # Dividir por la cantidad de filas (3)
    promedios_columnas.append(promedio)

# Mostrar los promedios de cada columna
print("\nPromedios de cada columna:")
for i in range(len(promedios_columnas)):
    print(f"Año {futuro[i]}: {round(promedios_columnas[i])}")