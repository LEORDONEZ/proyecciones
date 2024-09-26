import math

# Pedir el año actual
añoActual = int(input("Ingresa el año actual: "))
futuro = [añoActual, añoActual + 5, añoActual + 10, añoActual + 15, añoActual + 20, añoActual + 25]  # años futuro

n = int(input("Ingrese la cantidad de datos que quiere ingresar: "))

# Iniciar listas para almacenar los datos
años = []
poblaciones = []
m = []  # media (Puc-Pci)/(Tuc-Tci)
resultadospoblacion = []
resultadosaños = []
pf = []
diferencia = []
pf2 = []  # valores para el método exponencial

# Ingresar los datos de años a la lista años
print(f"Ingrese los {n} años:")

for i in range(n):
    año = int(input(f"Ingrese el año {i + 1}: "))
    años.append(año)  # añade el año a la lista de años

# Ingresar el número de población
print(f"Ingrese el número de población correspondiente para cada año ({n}):")
for i in range(n):
    poblacion = int(input(f"Ingrese el número de población para el año {años[i]}: "))
    poblaciones.append(poblacion)

ultimopoblacion = poblaciones[-1]
ultimoaño = años[-1]

for valor in poblaciones[:-1]:
    resultado = ultimopoblacion - valor
    resultadospoblacion.append(resultado)

for valor in años[:-1]:
    resultado = ultimoaño - valor
    resultadosaños.append(resultado)

for i in range(len(resultadospoblacion)):
    division = resultadospoblacion[i] / resultadosaños[i]
    m.append(division)

# Promedio de m
promedio = sum(m) / len(m)

for i in range(len(futuro)):
    resultado = futuro[i] - ultimoaño
    diferencia.append(resultado)

for i in range(len(diferencia)):
    resultado = ultimopoblacion + promedio * diferencia[i]
    pf.append(resultado)
print("metodo aritmetico")
print("Datos ingresados: \n")
print("METODO ARITMETICO#####")
print(f"El m promedio es {round(promedio, 2)}")
for i in range(n):
    if i < len(m):  # Mientras el índice sea válido para 'm'
        print(f"Año: {años[i]}, Población: {poblaciones[i]}, m: {round(m[i], 2)}")
    else:
        print(f"Año: {años[i]}, Población: {poblaciones[i]}, m: N/A")  # Para las posiciones donde no hay valor en 'm'

for i in range(len(pf)):
    print(f"Año {futuro[i]}, la población será con el metodo aritmetico {round(pf[i])}")

###################### Método exponencial ######################
k = []
for i in range(n - 1):
    resultado = (math.log(poblaciones[i + 1]) - math.log(poblaciones[i])) / (años[i + 1] - años[i])
    k.append(round(resultado, 4))

prom_exp = round(sum(k) / len(k), 4)
print(f"El valor de k promedio es {prom_exp}")

for i in range(len(futuro)):
    resultado = poblaciones[0] * math.exp(prom_exp * (futuro[i] - años[0]))
    pf2.append(round(resultado))
print("Metodo exponencial##########")
print("año    población")
for i in range(len(futuro)):
    print(f"\n  {futuro[i]}, es {pf2[i]}")

######################METODO GEOMETRICO##########################################
r = []
pf_=[] #guardo las variables para promediar
pf3= [] #valores finales 
for i in range(len(años)-1):
    resultado = (((poblaciones[-1])/poblaciones[i])**(1/((años[-1])-años[i])))-1
    r.append(round(resultado,7))
print(r)

matriz_resultados = []

for j in range(len(r)):
    fila = []
    for i in range(len(futuro)):
        resultado = poblaciones[-1]*(1+r[j])**(futuro[i]-años[-1])
        fila.append(round(resultado))
    matriz_resultados.append(fila)
#Diccionario para almacenar las variables dinámicas
print("Metodo geometrico #######")
variables = {}
for i, fila in enumerate(matriz_resultados):
    variables[f'a{i+1}'] = fila
print(f"Año  |Población  |      r      |   {futuro[0]}|{futuro[1]}|{futuro[2]}|{futuro[3]}|{futuro[4]}|{futuro[5]}")
for i, valor in enumerate(variables.values()):
    # Evitar imprimir el último elemento de años y población
    if i < len(años) - 1:
        print(f"{años[i]}|       {poblaciones[i]}", end=" ")
    else:
        print("-: -", end=" ")
    
    # Imprimir los valores de r y variables
    if i < len(r):
        print(f" |  {round(r[i],4)}     | {valor}")
    else:
        print(f"-: {valor}")
    


# Calcular el promedio de cada columna
promedios_columnas = []
for col in range(len(futuro)):  # Recorrer cada columna
    suma_columna = 0
    for fila in matriz_resultados:  # Recorrer cada fila en esa columna
        suma_columna += fila[col]
    promedio = suma_columna / len(r)  # Dividir por la cantidad de filas (3)
    promedios_columnas.append(promedio)

for i in range(len(promedios_columnas)):
    promedios_columnas[i]= round(promedios_columnas[i])

print(f"Promedio                       |{promedios_columnas}")

######################################### promedio de los metodos ######################
print("\nPromedios de todos los metodos:")
print("Año   Metodo geometrico    metodo exponencias  metodo aritmetico  Promedio total")
total = []
for i in range(len(promedios_columnas)):
    resultado = (round(promedios_columnas[i]) + pf2[i] + pf[i])/3
    total.append(resultado)

for i in range(len(promedios_columnas)):
    print(f"{futuro[i]}:       {round(promedios_columnas[i])}                 {pf2[i]}              {round(pf[i])}                 {round(total[i])}")

