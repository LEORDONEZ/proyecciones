promediosFinalesAño = []# con los arreglos guardados
promediosFinalespoblacion = []# con los arreglos guardados
ip_ = []
cp_ip = []
dn = []
dnt = []
p_ = []
dbruta = []
db_adoptada = []
Qmd = []
QmdM = []
cmH = []

# Conversión del input a número (float)
dn0 = float(input(f"Ingrese el primer valor de dn (dotación corregida) en el año cero ({promediosFinalesAño[0]}): "))
t0 = float(input(f"Ingrese la temperatura en °C "))
# Calcular ip_ (porcentajes de incremento entre años consecutivos)
for i in range(len(promediosFinalespoblacion) - 1):
    resultado = round(((promediosFinalespoblacion[i+1] - promediosFinalespoblacion[i]) * 100 / promediosFinalespoblacion[i]), 2)
    ip_.append(resultado)



# Calcular cp_ip (crecimiento por cada año)
for i in range(len(ip_)):
    resultado = round((ip_[i] / 10), 2)
    cp_ip.append(resultado)



# Calcular dn (dotación corregida en cada año)
dn.append(dn0)  # El primer valor de dn es dn0

for i in range(len(cp_ip)):
    resultado = dn[i] * ((cp_ip[i] / 100) + 1)
    dn.append(round(resultado))



if t0 > 28:
    t1 = float(input(" se debe corregir la dotacion corregida en un 15 a 20 ingrese el porcentaje a modificar 0.15 - 0.20"))
    for i in range(len(dn)):
        resultado = (t1*dn[i])+dn[i]
        dnt.append(resultado)
elif   20 <= t0 <= 28:
    t1 = float(input("Se debe corregir la dotación corregida en un 10 a 15 ingrese el porcentaje a modificar 0.15 - 0.10 ")) 
    for i in range(len(dn)):
        resultado = (t1*dn[i])+dn[i]
        dnt.append(resultado)
else:
    for i in range(len(dn)):
        resultado = dn[i]
        dnt.append(resultado)
    


pp= float(input(f"Ingrese el porcentaje por perdidas tecnicas de 30 a 20 "))
pf= float(input(f"Ingrese el porcentaje por perdidas final al que quiere llegar 10 o 15 "))


for i in range(len(dnt)):
    if i == 0:
        p_.append(pp)
    else:
        resultado = (pp-pf)/(len(dnt)-1) 
        resultado_suma = p_[i-1]-resultado
        p_.append(resultado_suma)



for i in range(len(dnt)):
    resultado = dnt[i]/(1-(p_[i]/100))
    dbruta.append(round(resultado))



def aproximar_multiplos5(numero):
    return round(numero /5)*5
db_adoptada=[aproximar_multiplos5(num) for num in dbruta]



for i in range(len(promediosFinalespoblacion)):
    resultado = (db_adoptada[i]*promediosFinalespoblacion[i])/86400
    Qmd.append(round(resultado,2))


for i in range(len(Qmd)):
    if promediosFinalespoblacion[i] <= 12500:
        k1 = 1.3
        k2 = 1.6
        resultado = Qmd[i] * k1
        resultado2 = Qmd[i] * k1 * k2
        QmdM.append(round(resultado,2))
        cmH.append(round(resultado2,2))

    else: 
        k1 = 1.2
        k2 = 1.5
        resultado = Qmd[i] * k1
        resultado2 = Qmd[i] * k1 * k2
        QmdM.append(round(resultado,2))
        cmH.append(round(resultado2,2))

#-1 Años futuros
print(promediosFinalesAño)
#0 pf poblacion futura 
print(promediosFinalesAño)
#1. incremento de población
print(f"Incrementos porcentuales (ip_): {ip_}")
#2. corrección a la poblacion por incremento
print(f"Crecimientos promediados (cp_ip): {cp_ip}")
#3. dotacion corregida 
print(f"Dotación corregida (dn): {dn}")
#4.dn corregida por t
print(dnt)
#5. perdidas tecnicas 
print(p_)
#6. db bruta
print(dbruta)
#7. db bruta adoptada
print(db_adoptada)
#8. qmd caudal medio diario 
print(Qmd)
#9. QMD caudal maximo diario 
print(QmdM)
#10. CMH
print(cmH)

# Imprimir encabezados de la tabla
print(f"{'AÑO':<6} | {'Pf[hab]':<10} | {'Ip(%)':<6} | {'C.P(%)':<8} | {'dn [L/(hab-día)]':<18} | {'dnT° [L/(hab-día)]':<18} | {'%P':<5} | {'dbruta [L/(hab-día)]':<18} | {'dbruta adoptada [L/(hab-día)]':<25} | {'Qmd [L/s]':<10} | {'QMD [L/S]':<10} | {'CMH [L/S]':<10}")
from tabulate import tabulate

# Asumo que ya tienes calculadas todas las listas: ip_, cp_ip, dn, dnt, p_, dbruta, db_adoptada, Qmd, QmdM, cmH

ip_.insert(0, '')  # Agregar un valor vacío para ip_
cp_ip.insert(0, '')  # Agregar un valor vacío para cp_ip

tabla = []

# Iterar sobre los valores y agregar filas a la tabla
for i in range(len(promediosFinalespoblacion)):
    fila = []
    
    # Asegurarse de que cada columna tenga datos o un valor vacío si no hay suficientes
    fila.append(promediosFinalesAño[i] if i < len(promediosFinalesAño) else '')  # Años
    fila.append(promediosFinalespoblacion[i] if i < len(promediosFinalespoblacion) else '')  # Población futura
    fila.append(ip_[i] if i < len(ip_) else '')  # Incremento porcentual
    fila.append(cp_ip[i] if i < len(cp_ip) else '')  # Crecimiento promediado
    fila.append(dn[i] if i < len(dn) else '')  # Dotación corregida
    fila.append(dnt[i] if i < len(dnt) else '')  # Dotación corregida por temperatura
    fila.append(p_[i] if i < len(p_) else '')  # Pérdidas técnicas
    fila.append(dbruta[i] if i < len(dbruta) else '')  # Dotación bruta
    fila.append(db_adoptada[i] if i < len(db_adoptada) else '')  # Dotación bruta adoptada
    fila.append(Qmd[i] if i < len(Qmd) else '')  # Caudal medio diario
    fila.append(QmdM[i] if i < len(QmdM) else '')  # Caudal máximo diario
    fila.append(cmH[i] if i < len(cmH) else '')  # Caudal máximo horario
    
    # Agregar la fila completa a la tabla
    tabla.append(fila)

# Encabezados de las columnas
encabezados = ["AÑO", "Pf[hab]", "Ip(%)", "C.P(%)", "dn [L/(hab-día)]", "dnT° [L/(hab-día)]", 
               "%P", "dbruta [L/(hab-día)]", "dbruta adoptada [L/(hab-día)]", "Qmd [L/s]", 
               "QMD [L/S]", "CMH [L/S]"]

# Imprimir la tabla con el formato "grid"
print(tabulate(tabla, headers=encabezados, tablefmt="grid"))



