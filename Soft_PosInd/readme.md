1-Levanta los datos desde un CSV (definido en el .h, por ahora no se pasa por parámetro) y los carga en un ARRAY dinámico de estructuras.

2-Calcula los cortes de las vueltas, es decir la posición (índice del ARRAY) donde empieza cada vuelta. 
Estos cortes se calculan a partir de la elección del usuario de una posición en el circuito (esta coordenadas que tiene que estar en el ARRAY),
sumado al ancho de pista. Por ahora son valores fijos dentro del código.

3-Calcula distancia entre muestras y tiempo entre muestras para después calcular los tiempos de cada vuelta. 
(Con estos datos ya se podría gráficar en función del tiempo y de la distancia).

4-Busca la vuelta más rápida para tomarla de referencia. Esta vuelta tendrá X muestras. 
Vamos a reducir las demás vueltas a X muestras.

5-Resamplea todas las vueltas y guarda c/u en un archivo separado.
(Con estos datos ya se podría gráficar en función del "position index")

En el .h están los #define que habilitan la carga de datos de los distintos circuitos.


Para compilar: 

gcc index.c -Wall -pedantic -lm -o index.out
