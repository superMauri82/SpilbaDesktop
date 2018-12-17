#include <stdint.h>
#include <stdbool.h>
#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <math.h>
#include "positionIndex_SPILBA.h"




//Variables globales
double gX_normal[2];
double gRecta_normal[2];

int length (double *arr)
{
    int size;

    size = *(&arr + 1) - arr;
    return size;
}

int minimum(double *a, int n)
{
  int c, index;
  double min;

  min = a[0];
  index = 0;

  for (c = 1; c < n; c++)
  {
    if (a[c] < min)
    {
       index = c;
       min = a[c];
    }
  }

  return index;
}

void cumsum(double *array, double *sum, int index)
{
    /*if(--index <= 0) return;
    cumsum(array, sum, index);
    sum [index] = array[index] + array[index - 1];*/

    int i;
    sum[0] = array[0];

    for(i = 1; i < index; i++)
        sum[i] = sum[i-1] + array[i];

}


//FunciÃ³n que pasa de minutos decimales (MMMM.xxxx) a grados decimales (DD.xxxx)
double minDec2degDec (double minDec)
{
  int deg;
  double mins, degDec;

  deg  = (int)(minDec/60); //Parte entera
  mins = minDec - deg*60; //Parte decimal
  degDec = deg + mins/60;

  return degDec;
}

void minDec2degDec_vector (double *minDec, double *degDec, int LARGO_vector)
{
    //int LARGO_vector;
    int i;

    //LARGO_vector = NELEMS(minDec); //está bien eso???
    //LARGO_vector = 8655;

    //printf("LARGO\n %i", LARGO_vector);

    for (i=0; i<LARGO_vector; i++)
    {
        degDec[i] = minDec2degDec(minDec[i]);
    }

}

void normal_con_dos_puntos (double x1, double x2, double y1, double y2, double ancho_pista, double *x_normal, double *recta_normal)
{
    double ancho_lat_degree;

    //https://stackoverflow.com/questions/1253499/simple-calculations-for-working-with-lat-lon-km-distance
    ancho_lat_degree = ancho_pista/110574;
    //ancho_log_degree = 111320 * cos(ancho_lat_degree*pi/180);

    x_normal[0]=x1-ancho_lat_degree;
    x_normal[1]=x1+ancho_lat_degree;

    recta_normal[0]=(-1)*(x2-x1)/(y2-y1)*(x_normal[0]-x1)+y1;
    recta_normal[1]=(-1)*(x2-x1)/(y2-y1)*(x_normal[1]-x1)+y1;
}


void normal_con_un_punto(double lat, double lon, double heading, int ancho_pista)
{
  //FunciÃ³n que calcula
  ////Heading en deg
  double Dlat,Dlong;
  double propor_lat,propor_long;

  Dlat    =sin(heading*PI/180)*ancho_pista;
  Dlong   =cos(heading*PI/180)*ancho_pista;

  propor_lat  = Dlat/(110.6*1000);
  propor_long = Dlong*180/(PI*ER*cos(lat*PI/180));

  gX_normal[0] =lat-propor_lat/2;
  gX_normal[1] =lat+propor_lat/2;

  gRecta_normal[0] =lon-propor_long/2;
  gRecta_normal[1] =lon+propor_long/2;

}

bool lineSegmentIntersection(double Ax, double Bx, double Cx, double Dx, double Ay, double By, double Cy, double Dy, double *X, double *Y)
{

  double  distAB, theCos, theSin, newX, ABpos ;

  //  Fail if either line segment is zero-length.
  if ((Ax==Bx && Ay==By) || (Cx==Dx && Cy==Dy))
  {
      //printf("Ax:%f Bx:%f Ay:%f By:%f Cx:%f Dx:%f Cy:%f Dy:%f \n", Ax,Bx,Ay,By,Cx,Dx,Cy,Dy);
      //printf("hola1\n");
      return false;
  }

  //  Fail if the segments share an end-point.
  if ((Ax==Cx && Ay==Cy) || (Bx==Cx && By==Cy)
  ||  (Ax==Dx && Ay==Dy) || (Bx==Dx && By==Dy))
  {
    //printf("hola2\n");
    return false;
  }

  //  (1) Translate the system so that point A is on the origin.
  Bx-=Ax; By-=Ay;
  Cx-=Ax; Cy-=Ay;
  Dx-=Ax; Dy-=Ay;

  //  Discover the length of segment A-B.
  distAB=sqrt(Bx*Bx+By*By);

  //  (2) Rotate the system so that point B is on the positive X axis.
  theCos=Bx/distAB;
  theSin=By/distAB;
  newX=Cx*theCos+Cy*theSin;
  Cy  =Cy*theCos-Cx*theSin; Cx=newX;
  newX=Dx*theCos+Dy*theSin;
  Dy  =Dy*theCos-Dx*theSin; Dx=newX;

  //  Fail if segment C-D doesn't cross line A-B.
  if ((Cy<0 && Dy<0) || (Cy>=0 && Dy>=0))
  {
      //printf("hola3\n");
      return false;
  }

  //  (3) Discover the position of the intersection point along line A-B.
  ABpos=Dx+(Cx-Dx)*Dy/(Dy-Cy);

  //  Fail if segment C-D crosses line A-B outside of segment A-B.
  if (ABpos<0. || ABpos>distAB)
  {
      //printf("hola4\n");
      return false;
  }

  //  (4) Apply the discovered position to line A-B in the original coordinate system.
  *X=Ax+ABpos*theCos;
  *Y=Ay+ABpos*theSin;

  //  Success.
  return true;
}


int get_line_intersection(double p0_x, double p1_x, double p2_x, double p3_x, double p0_y, double p1_y, double p2_y, double p3_y, double *i_x, double *i_y)
{
    double s02_x, s02_y, s10_x, s10_y, s32_x, s32_y, s_numer, t_numer, denom, t;

    s10_x = p1_x - p0_x;
    s10_y = p1_y - p0_y;
    s32_x = p3_x - p2_x;
    s32_y = p3_y - p2_y;

    denom = s10_x * s32_y - s32_x * s10_y;
    if (denom == 0)
        return 0; // Collinear
    bool denomPositive = denom > 0;

    s02_x = p0_x - p2_x;
    s02_y = p0_y - p2_y;
    s_numer = s10_x * s02_y - s10_y * s02_x;
    if ((s_numer < 0) == denomPositive)
        return 0; // No collision

    t_numer = s32_x * s02_y - s32_y * s02_x;
    if ((t_numer < 0) == denomPositive)
        return 0; // No collision

    if (((s_numer > denom) == denomPositive) || ((t_numer > denom) == denomPositive))
        return 0; // No collision
    // Collision detected
    t = t_numer / denom;
    if (i_x != NULL)
        *i_x = p0_x + (t * s10_x);
    if (i_y != NULL)
        *i_y = p0_y + (t * s10_y);

    return 1;
}


void interseg_seg( double x1, double x2, double x3, double x4, double y1, double y2, double y3, double y4, double *solucion_x, double *solucion_y)
{
  //INTERSEG_SEG Summary of this function goes here
  //  Detailed explanation goes here
  //http://stackoverflow.com/questions/563198/how-do-you-detect-where-two-line-segments-intersect
  double Ex,Ey;
  double Fx,Fy;
  double Px,Py;

  double H1x, H1y;
  double H2, H3;

  double h;

  Ex=x2-x1;
  Ey=y2-y1;
  Fx=x4-x3;
  Fy=y4-y3;

  Px=-Ey;
  Py=Ex;

  H3=Fx*Px+Fy*Py;

  H1x=x1-x3;
  H1y=y1-y3;

  H2=H1x*Px+H1y*Py;

  h=H2/H3;

  if(h>0 && h<=1)
  {
    *solucion_x=x3+Fx*h;
    *solucion_y=y3+Fy*h;
  }
  else
  {
    *solucion_x=145; //muy hardcodeado
    *solucion_y=145;
  }
}

double Haversine(double lat1, double lon1, double lat2, double lon2)
{
  //distancia entre 2 coordenadas. This is not the exact measurement because the
  //formula assumes that the Earth is a perfect sphere when in fact it is an oblate spheroid.
  //lo devuelve en kilometros
  double dLat, dLon;
  double tlat1, tlat2;
  double a,c,distancia;

  //distance between latitudes and longitudes en radianes
  dLat = (lat2 - lat1) * PI / 180.0;
  dLon = (lon2 - lon1) * PI / 180.0;

  //convert to radians
  tlat1 = (lat1) * PI / 180.0;
  tlat2 = (lat2) * PI / 180.0;

  //apply formulae
  a = pow(sin(dLat / 2), 2) +   pow(sin(dLon / 2), 2) *  cos(tlat1) * cos(tlat2);
  c = 2 * asin(sqrt(a));
  distancia = (ER/1000) * c;

  return distancia;
}

//FunciÃ³n que Calcula el LARGO de la vuelta
double *largo_vuelta (double *sesion_completa, unsigned int inicio, unsigned int final)
{
  int n, i=0;
  double *distancia_total;

  distancia_total = (double*) malloc ( (final-inicio)*sizeof(double) ); //pedimos memoria

  distancia_total[0]=sesion_completa[inicio];

  for(n = inicio; n < final; n++)
  {
    distancia_total[i] = distancia_total[i-1]+sesion_completa[n];
    i=i+1;
  }

  free(distancia_total); //libero memoria

  return distancia_total;
}


sSpilbaDataRow *resampleo_falso (sSpilbaDataRow *vuelta_original, sSpilbaDataRow *vuelta_modelo, int LARGO_modelo, int LARGO_original)
{

  int c=0, index=0, i;
  int n,m;
  sSpilbaDataRow *vuelta_resampleada;
  double *original_lat, *original_long;
  double *modelo_lat, *modelo_long;
  double arclen, distancia_m;
  double solucion_x, solucion_y;
  double *temp;
  bool intersection;


  double x_normal[2];
  double recta_normal[2];

  vuelta_resampleada = (sSpilbaDataRow*) malloc (LARGO_modelo * sizeof(sSpilbaDataRow) );

  temp              = (double*) malloc (LARGO_original * sizeof(double) );
  original_lat      = (double*) malloc (LARGO_original * sizeof(double) );
  original_long     = (double*) malloc (LARGO_original * sizeof(double) );

  for(i=0; i<LARGO_original;i++)
      temp[i]=vuelta_original[i].lat;
  minDec2degDec_vector(temp, original_lat, LARGO_original);

  for(i=0; i<LARGO_original;i++)
      temp[i]=vuelta_original[i].lon;
  minDec2degDec_vector(temp, original_long, LARGO_original);

  free (temp);

  temp              = (double*) malloc (LARGO_modelo * sizeof(double) );
  modelo_lat        = (double*) malloc (LARGO_modelo * sizeof(double) );
  modelo_long       = (double*) malloc (LARGO_modelo * sizeof(double) );

  for(i=0; i<LARGO_modelo;i++)
      temp[i]=vuelta_modelo[i].lat;
  minDec2degDec_vector(temp, modelo_lat, LARGO_modelo);

  for(i=0; i<LARGO_modelo;i++)
      temp[i]=vuelta_modelo[i].lon;
  minDec2degDec_vector(temp, modelo_long, LARGO_modelo);

  free (temp);

  //for(i=0; i<LARGO_original;i++)
   //   printf("vuelta_original[%i].lat:%f\n",i, vuelta_original[i].lat);



  //Recorro todito el vector de la vuelta rápida
  for(n=0; n<LARGO_modelo-3; n++)
  {
      //Tomo segmentos más LARGOS(3 elementos) de n+1 a n+3, arrancao desde el n+1 porque me puede tocar que solo haya cruce
      // en la ultima muestra, entonces jode tutto.
      //Está medio hardcodeado todito habría que pensarla un poco mejor este resampleo_falso
      normal_con_dos_puntos(modelo_lat[n+1], modelo_lat[n+3], modelo_long[n+1], modelo_long[n+3], 25, x_normal, recta_normal);

      //printf("x_normal[0]:%f ", x_normal[0]);
      //printf("recta_normal[0]:%f\n", recta_normal[0]);



      for (m = index; m < LARGO_original-2; m++)
      {
//          interseg_seg(x_normal[0],              //x1
//                       x_normal[1],               //x2
//                       original_lat[m],           //x3
//                       original_lat[m+2],         //x4
//                       recta_normal[0],           //y1
//                       recta_normal[1],           //y2
//                       original_long[m],          //y3
//                       original_long[m+2],        //y4
//                       &solucion_x,
//                       &solucion_y);

          intersection = lineSegmentIntersection( x_normal[0],               //x1
                                                  x_normal[1],               //x2
                                                  original_lat[m],           //x3
                                                  original_lat[m+2],         //x4
                                                  recta_normal[0],           //y1
                                                  recta_normal[1],           //y2
                                                  original_long[m],          //y3
                                                  original_long[m+2],        //y4
                                                  &solucion_x,
                                                  &solucion_y);


//          intersection = get_line_intersection( x_normal[0],               //x1
//                                                x_normal[1],               //x2
//                                                original_lat[m],           //x3
//                                                original_lat[m+2],         //x4
//                                                recta_normal[0],           //y1
//                                                recta_normal[1],           //y2
//                                                original_long[m],          //y3
//                                                original_long[m+2],        //y4
//                                                &solucion_x,
//                                                &solucion_y);


          //printf("intersection:%i ... n:%i ... m:%i ....... index:%i\n", intersection, n, m, index);

          if (intersection)
          //if (solucion_x != 145)
          {
              arclen = Haversine(modelo_lat[n], modelo_long[n], solucion_x, solucion_y);
              distancia_m = arclen*1000;
              //printf("hola:%i\n", c);
              if (distancia_m <=100)
              {
                //printf("hola:%i\n", c);
                vuelta_resampleada[c]=vuelta_original[m];
                c=c+1;
                index=m+1;
                break;
              }
          }
          //printf(" n:%i \n", n);
      }


      //vuelta_resampleada[c+1]=vuelta_original[m+1];
      //vuelta_resampleada[c+2]=vuelta_original[m+2];
      //vuelta_resampleada[c+3]=vuelta_original[m+3];
      //vuelta_resampleada[c+4]=vuelta_original[m+3];


  }
  //printf("n:%i m: %i\n\n\n", n, m);

  free (original_lat);
  free (original_long);
  free (modelo_lat);
  free (modelo_long);

  //for(i=0; i<LARGO_modelo;i++)
    //  printf("vuelta_resampleada[%i]:%f\n", i, vuelta_resampleada[i].velocity_kmh);

  return vuelta_resampleada;
}

int main (void)
{
    FILE * fp_out;

    sSpilbaDataRow *datosSpilba, *vuelta_rapida, *vuelta_original, *vuelta_al; //habría que leer el CSV y cargarlo a esta estructura, y de paso calcular el LARGO del array
    double *lat, *lon, *direccion, *velocity_ms;
    double *temp;
    int heading_marker, ancho_pista, total_vueltas;
    double LapMarker_lat_minutes[2], LapMarker_long_minutes[2];
    double LapMarker_lat_degree[2],  LapMarker_long_degree[2];
    int n, ind, b, i, j=0, a;
    double solucion_x, solucion_y;
    double arclen, distancia_m, *delta_distancia_metros;
    double *cruze_x, *cruze_y;                      //hay que pedir memoria???
    int *position_index;                            //hay que pedir memoria???
    double *marker_spilba_lat, *marker_spilba_long; //hay que pedir memoria???
    double *delta_distancia;                        //hay que pedir memoria???
    double *delta_tiempo, *vuelta_tiempos_seg;                           //hay que pedir memoria???
    double *tiempo_total_seg;
    //double *tiempo_total_seg;                       //hay que pedir memoria???
    int cant_vueltas;
    double *vuelta_metros;
    //double *vuelta;
    double delta_distancia_prueba;
    double delta_tiempo_prueba;
    char line[101];
    char *item;
    double *vuelta_tiempos_acumulada_seg;
    double *tiempos_cada_vuelta_seg;
    //char **tiempos_cada_vuelta;

    bool intersection;

    char stVuelta[10];

    int    nro_vuelta_rapida;
    double tiempo_rapido;
    int p,q;

    int LARGO=0;
#ifdef MOURAS
    FILE *fp_1 = fopen("datos_mouras.txt", "r");
#endif
#ifdef TERMAS
    FILE *fp_1 = fopen("datos_termas_dom.txt", "r");
#endif
#ifdef BAIRES
    FILE *fp_1 = fopen("datos_canapa_1000kmBaires.txt", "r");
#endif
    if (fp_1 == NULL) perror ("Error opening file");

        while (fgets(line,120,fp_1) != NULL)
            LARGO++;
    fclose(fp_1);
    // Defino el largo del archivo
    printf("El largo del archivo es %i\n\n", LARGO);

    //Reservo memoria
    lon                     = (double*) malloc (LARGO * sizeof(double) );
    lat                     = (double*) malloc (LARGO * sizeof(double) );
    temp                    = (double*) malloc (LARGO * sizeof(double) );
    velocity_ms             = (double*) malloc (LARGO * sizeof(double) );
    direccion               = (double*) malloc (LARGO * sizeof(double) );
    delta_distancia         = (double*) malloc (LARGO * sizeof(double) );
    delta_tiempo            = (double*) malloc (LARGO * sizeof(double) );
    tiempo_total_seg        = (double*) malloc (LARGO * sizeof(double) );
    vuelta_tiempos_seg      = (double*) malloc (LARGO * sizeof(double) );
    delta_distancia_metros  = (double*) malloc (LARGO * sizeof(double) );

    datosSpilba     = (sSpilbaDataRow*) malloc (LARGO * sizeof(sSpilbaDataRow) );

    #warning"hardcoded!!"
    cant_vueltas =190;

    cruze_x                 = (double*) malloc (cant_vueltas * sizeof(double) );
    cruze_y                 = (double*) malloc (cant_vueltas * sizeof(double) );
    marker_spilba_lat       = (double*) malloc (cant_vueltas * sizeof(double) );
    marker_spilba_long      = (double*) malloc (cant_vueltas * sizeof(double) );
    tiempos_cada_vuelta_seg = (double*) malloc (cant_vueltas * sizeof(double) );
    position_index          = (int*) malloc (cant_vueltas * sizeof(int) );

    //char **tiempos_cada_vuelta = (char **)malloc(cant_vueltas * sizeof(char *));
    //for (i=0; i< cant_vueltas; i++)
    //     tiempos_cada_vuelta[i] = (char *)malloc(MAX_STRING_SIZE * sizeof(char));
    char tiempos_cada_vuelta[MAX_STRING_SIZE];


    //****************************


#ifdef MOURAS
    FILE *fp = fopen("datos_mouras.txt", "r");
#endif
#ifdef TERMAS
    FILE *fp = fopen("datos_termas_dom.txt", "r");
#endif
#ifdef BAIRES
    FILE *fp = fopen("datos_canapa_1000kmBaires.txt", "r");
#endif
    if (fp == NULL) perror ("Error opening file");

    while (fgets(line,120,fp) != NULL)
    {
        //printf("%s\n",lyne);
        //printf("%i\n",j);

#ifdef MOURAS
        item = strtok(line,",");
        datosSpilba[j].sats         = atof(item);

        item = strtok(NULL,",");
        datosSpilba[j].time         = atof(item);

        item = strtok(NULL,",");
        datosSpilba[j].lat          = atof(item);

        item = strtok(NULL,",");
        datosSpilba[j].lon          = atof(item);

        item = strtok(NULL,",");
        datosSpilba[j].velocity_kmh = atof(item);

        item = strtok(NULL,",");
        datosSpilba[j].heading      = atof(item);

        item = strtok(NULL,",");
        datosSpilba[j].height       = atof(item);

        item = strtok(NULL,",");
        datosSpilba[j].Lat_accel    = atof(item);

        item = strtok(NULL,",");
        datosSpilba[j].Long_accel   = atof(item);

        item = strtok(NULL,",");
        datosSpilba[j].Vert_accel   = atof(item);

        item = strtok(NULL,",");
        datosSpilba[j].Gyro_x       = atof(item);

        item = strtok(NULL,",");
        datosSpilba[j].Gyro_y       = atof(item);

        item = strtok(NULL,"\n");
        datosSpilba[j].Gyro_z       = atof(item);
#endif

#ifdef TERMAS
        item = strtok(line,",");
        datosSpilba[j].sats         = atof(item);

        item = strtok(NULL,",");
        datosSpilba[j].time         = atof(item);

        item = strtok(NULL,",");
        datosSpilba[j].lat          = atof(item);

        item = strtok(NULL,",");
        datosSpilba[j].lon          = atof(item);

        item = strtok(NULL,",");
        datosSpilba[j].velocity_kmh = atof(item);

        item = strtok(NULL,",");
        datosSpilba[j].heading      = atof(item);

        item = strtok(NULL,",");
        datosSpilba[j].height       = atof(item);

        item = strtok(NULL,",");
        datosSpilba[j].Vert_accel   = atof(item);

        item = strtok(NULL,",");
        datosSpilba[j].Gyro_x       = atof(item);
#endif

#ifdef BAIRES


        item = strtok(line,",");
        datosSpilba[j].sats         = atof(item);

        item = strtok(NULL,",");
        datosSpilba[j].time         = atof(item);

        item = strtok(NULL,",");
        datosSpilba[j].lat          = atof(item);

        item = strtok(NULL,",");
        datosSpilba[j].lon          = atof(item);

        item = strtok(NULL,",");
        datosSpilba[j].velocity_kmh = atof(item);

        item = strtok(NULL,",");
        datosSpilba[j].heading      = atof(item);

        item = strtok(NULL,",");
        datosSpilba[j].height       = atof(item);

        item = strtok(NULL,",");
        datosSpilba[j].Lat_accel    = atof(item);

        item = strtok(NULL,",");
        datosSpilba[j].Long_accel   = atof(item);

        item = strtok(NULL,",");
        datosSpilba[j].Vert_accel   = atof(item);

        item = strtok(NULL,",");
        datosSpilba[j].Temp         = atof(item);

        item = strtok(NULL,",");
        datosSpilba[j].Vbatt        = atof(item);

        item = strtok(NULL,"\n");
        datosSpilba[j].RPM          = atof(item);

        item = strtok(NULL,",");
        datosSpilba[j].Marcha       = atof(item);

        item = strtok(NULL,",");
        datosSpilba[j].Signal       = atof(item);

        item = strtok(NULL,"\n");
        datosSpilba[j].Receiver       = atof(item);

        item = strtok(NULL,"\n");
        datosSpilba[j].Retries       = atof(item);
#endif

        j++;
    }
    fclose(fp);

    // Transformamos vector de latitudes y longitudes en minutos decimales a grados decimales

    for(i=0; i<LARGO;i++)
        temp[i]=datosSpilba[i].lat;
    minDec2degDec_vector(temp, lat, LARGO);

    for(i=0; i<LARGO;i++)
        temp[i]=datosSpilba[i].lon;
    minDec2degDec_vector(temp, lon, LARGO);

    //paso la vel a m/s
    for(i=0; i<LARGO;i++)
        velocity_ms[i] = datosSpilba[i].velocity_kmh/3.6;

    free(temp);

    //Asigno start/finish. Se eligen dos coordenadas del total que tiene el archivo
    //(el usuario debería elegir esto)

    //Datos de la plata
#ifdef MOURAS
    LapMarker_lat_minutes[0]          = -2098.803000;
    LapMarker_lat_minutes[1]          = -2098.791000;
    LapMarker_long_minutes[0]         = 3490.576300;
    LapMarker_long_minutes[1]         = 3490.604900;
#endif

#ifdef TERMAS
    LapMarker_lat_minutes[0]          = -1650.130520;
    LapMarker_lat_minutes[1]          = -1650.134930;
    LapMarker_long_minutes[0]         = 3894.608380;
    LapMarker_long_minutes[1]         = 3894.623130;
#endif

    //Datos del 12 de baires
#ifdef BAIRES

//    LapMarker_lat_minutes[0]          = -2081.6812;
//    LapMarker_lat_minutes[1]          = -2081.6924;
//    LapMarker_long_minutes[0]         = 3507.7079;
//    LapMarker_long_minutes[1]         = 3507.7167;

    LapMarker_lat_minutes[0]          = -2081.8420;
    LapMarker_lat_minutes[1]          = -2081.8386;
    LapMarker_long_minutes[0]         = 3507.4821;
    LapMarker_long_minutes[1]         = 3507.4685;
#endif


    for(i=0; i<LARGO;i++)
        direccion[i] = datosSpilba[i].heading;

    //Como estan en minutos, los paso a grados
    LapMarker_lat_degree[0]    = minDec2degDec(LapMarker_lat_minutes[0]);
    LapMarker_long_degree[0]   = minDec2degDec(LapMarker_long_minutes[0]);

    LapMarker_lat_degree[1]    = minDec2degDec(LapMarker_lat_minutes[1]);
    LapMarker_long_degree[1]   = minDec2degDec(LapMarker_long_minutes[1]);

    //Como yo sé que el valor de LapMarker fui elegido de la data, busco en qué posición del vector está.
    //Es decir busco su índice

    for (n = 0;n<LARGO;n++)
    {
        if( lat[n] == LapMarker_lat_degree[0] && lon[n] == LapMarker_long_degree[0])
            heading_marker=n;
    }

    //printf("heading_marker:%i\n", heading_marker);
    //printf("LapMarker_lat_degree[0]:%f\n", LapMarker_lat_degree[0]);
    //printf("LapMarker_lat_degree[0]:%f\n", LapMarker_long_degree[0]);


    //Defino mi ancho de pista. En ppio esto debería definir de mi recta normal, así puedo saber si la cruza o no en ese segmento.
    ancho_pista=25;

    //Esto devuelve (x1,y1) (x2,y2) que forman parte de la recta normal a la recta que pasa por los dos puntos LapMarker
    normal_con_un_punto(LapMarker_lat_degree[0], LapMarker_long_degree[0], direccion[heading_marker],ancho_pista);


    //printf("gX_normal[0]:%f\n",gX_normal[0]);
    //printf("gX_normal[1]:%f\n",gX_normal[1]);

    //printf("gRecta_normal[0]:%f\n",gRecta_normal[0]);
    //printf("gRecta_normal[1]:%f\n",gRecta_normal[1]);


    //Busco la interseccion entre esa recta normal y las rectas formadas por dos puntos(coordenadas) consecutivos.
    //Como algunas interseccciones puede que estén a 100km, elijo los valores más "cercanos". La distancia que define la cercanía tendría
    //que estar relacionada con el ancho de pista pero esto no está implementado. Se pone un distancia a ojo. Entonces saco
    //donde están los cortes de TODAS vueltas.
    ind = 0;

    for (n=0; n<LARGO-1; n++)
    {

        /*interseg_seg(   gX_normal[0],   //x1
                        gX_normal[1],   //x2
                        lat[n],         //x3
                        lat[n+1],       //x4
                        gRecta_normal[0],   //y1
                        gRecta_normal[1],   //y2
                        lon[n],             //y3
                        lon[n+1],           //y4
                        &solucion_x,
                        &solucion_y
                        );*/

     intersection = lineSegmentIntersection(
                         gX_normal[0],   //x1
                         gX_normal[1],   //x2
                         lat[n],         //x3
                         lat[n+1],       //x4
                         gRecta_normal[0],   //y1
                         gRecta_normal[1],   //y2
                         lon[n],             //y3
                         lon[n+1],           //y4
                         &solucion_x,
                         &solucion_y
                         );

      if (intersection)
      {
            arclen = Haversine(  LapMarker_lat_degree[0], LapMarker_long_degree[0],
                                 solucion_x,              solucion_y);
            distancia_m = arclen*1000;

            if (distancia_m <= 10)
            {
                cruze_x[ind]=solucion_x;
                cruze_y[ind]=solucion_y;
                marker_spilba_lat [ind]=lat[n+1];
                marker_spilba_long[ind]=lon[n+1];
                //Acá a la variable la llamo position index, pero en realidad es la posición (índice del vector) donde empieza cada vuelta!!
                position_index[ind]=n;
                ind = ind + 1;
            }
      }

    }

    total_vueltas = ind;

    printf("total_vueltas:%i\n\n",total_vueltas-1);

    //for (n=0; n<total_vueltas; n++)
    //    printf("position_index[%i]:%i\n", n, position_index[n]);


    //Calculo los deltas de distancia y tiempo
    //Aunque yo YA SÉ que el gps toma 10 muestras por segundo, hago esto para inventarle más digitos después
    //de la coma
    b=1;

    #warning "Son necesarias las dos líneas de abajo??"
    delta_distancia[0]  = 0;
    delta_tiempo[0] = 0;


    #warning "Acá, hay dos problemas. Se dan cuando la velocidad es 0 o la distancia es 0 (que pueden darse tranquilamente en boxes). Harcodeo??? A efectos prácticos no debería pasar nada"
    for (n = 0; n<LARGO-1; n++)
    {
        delta_distancia[b]  = Haversine(lat[n],lon[n],lat[n+1],lon[n+1])*1000;

        if(velocity_ms[n] == 0)
            if(delta_distancia[b] == 0)
                delta_tiempo[b]     = 0.1;
            else
                delta_tiempo[b]     = delta_distancia[b]/0.00001;
        else
            if(delta_distancia[b] == 0)
                delta_tiempo[b]     = 0.1;
            else
                delta_tiempo[b]     = delta_distancia[b]/velocity_ms[n];


        #warning "ojo que por lo explicado abajo, las vueltas que entre el auto a boxes van a ser cualquier cosa con el position index"
        //hiper re contra hardcodeado!!!! Hay momentos que me dan valores gigante sin sentido cuando está parado en boxes
        //entonces como nunca pueden más que 0.2, lo bloqueo y listorti.
        if(delta_tiempo[b]>0.2)
            delta_tiempo[b]=0.1;

        b++;
    }


//    for(i=0; i<230;i++)
//    {
//        printf("delta_distancia[%i]=%f \t\t", i, delta_distancia[i]);
//        printf("delta_tiempo[%i]=%f\n", i, delta_tiempo[i]);
//    }



    //inicializo vectores con ceros

    //tiempos_cada_vuelta_seg         = zeros(total_vueltas-2,1);

    //tiempos_cada_vuelta = cell(total_vueltas-1,1);

    //Hago la suma acumulada para sacar el tiempo total de la tanda
    cumsum(delta_tiempo, tiempo_total_seg, LARGO);

    //for(i=0; i<LARGO;i++)
   //     printf("tiempo_total_seg[%i]=%f\n", i, tiempo_total_seg[i]);


    //Calculo la distancia entre muestras y después
    for (n=0;n<LARGO-1;n++)
        delta_distancia[n] = Haversine(lat[n],lon[n],lat[n+1],lon[n+1]);


    for(i=0; i<LARGO;i++)
        delta_distancia_metros[i] = delta_distancia[i]*1000;

    //printf("delta_distancia_metros[0]:%f\n",delta_distancia_metros[0]);


    for (a=0;a<total_vueltas-1;a++)
    //for (a=145;a<146;a++)
    {


        //        #warning "este bloque va si tengo que graficar directamente"
        //        j=0;
        //        vuelta = (double*) malloc ( (position_index[a+1]-position_index[a]) * sizeof(double) );
        //
        //        if (vuelta  == NULL)
        //        {
        //            perror ("Error");
        //        }
        //
        //        //Tomo las muestras de cada vuelta, en este caso las muestras de velocidad
        //        for(i=position_index[a]; i<position_index[a+1];i++)
        //        {
        //
        //            //printf("datosSpilba[%i].velocity_kmh:%f\n", i, datosSpilba[i].velocity_kmh);
        //            vuelta[j] = datosSpilba[i].velocity_kmh;
        //            j++;
        //        }


        //Acá en vuelta_metros está cada vuelta en metros
        vuelta_metros = largo_vuelta(delta_distancia_metros,position_index[a],position_index[a+1]);

        printf("Se analiza desde %i hasta %i ---> %i muestras\t", position_index[a], position_index[a+1], position_index[a+1]-position_index[a]);

        //Acá en vuelta_tiempos_seg está cada vuelta en segundos. Tomo partes del delta_tiempo en función del inicio y fin de la vuelta
        for(i=position_index[a], j=0; i<position_index[a+1]; i++)
        {
            vuelta_tiempos_seg[j] = delta_tiempo[i];
            j++;
        }

        //Tomo la distancia total entre el final de la vuelta y el inicio.
        #warning "por qué es cruce y no directamente usar el position index???"
        delta_distancia_prueba = Haversine( lat[position_index[a+1]], lon[position_index[a+1]], cruze_x[a],cruze_y[a])*1000;


        delta_tiempo_prueba = delta_distancia_prueba/velocity_ms[position_index[a+1]-1];
        //printf("delta_tiempo_prueba:%f\n",delta_tiempo_prueba);

        vuelta_tiempos_acumulada_seg = (double*) malloc ( (position_index[a+1]-position_index[a]) * sizeof(double) );

        cumsum(vuelta_tiempos_seg, vuelta_tiempos_acumulada_seg, position_index[a+1]-position_index[a]);

//        for(i=0; i<position_index[a+1]-position_index[a]; i++)
//        {
//            printf("vuelta_tiempos_seg[%i]:%f\n",i,vuelta_tiempos_seg[i]);
//            printf("vuelta_tiempos_acumulada_seg[%i]:%f \t",i,vuelta_tiempos_acumulada_seg[i]);
//        }


        //En este array están los tiempos de vueltas en segundos
        tiempos_cada_vuelta_seg[a]=vuelta_tiempos_acumulada_seg[position_index[a+1]-position_index[a]-1]-delta_tiempo_prueba;

        //printf("vuelta_tiempos_acumulada_seg:%f\n",vuelta_tiempos_acumulada_seg[position_index[a+1]-position_index[a]-1]); //el -1 es por el tema de los array en C empiezan en la pos 0

        printf("vuelta %i en seg: %f \t---->",a+1,tiempos_cada_vuelta_seg[a]);

        //Acá grabo en un string los tiempos de vueltas
        sprintf( tiempos_cada_vuelta, "%.f:%0.2f", floor(tiempos_cada_vuelta_seg[a]/60),
                                                    tiempos_cada_vuelta_seg[a]-floor(tiempos_cada_vuelta_seg[a]/60)*60);

        printf("%s\n",tiempos_cada_vuelta);

        //free(vuelta);
        free(vuelta_tiempos_acumulada_seg);

   }

    printf("\n\n");


    //Voy dividir vueltas en función del position index, así grafico.
    //Tengo que elegir la vuelta más rápida. Por eso busco el "min"
    //la llamo vuelta_rápida

    nro_vuelta_rapida=minimum(tiempos_cada_vuelta_seg, total_vueltas-1);
    tiempo_rapido=tiempos_cada_vuelta_seg[nro_vuelta_rapida];

    printf("vuelta %i (rapida) en seg: %f \t---->",nro_vuelta_rapida+1,tiempo_rapido);

    //Acá grabo en un string los tiempos de vueltas
    sprintf( tiempos_cada_vuelta, "%.f:%0.2f", floor(tiempo_rapido/60),tiempo_rapido-floor(tiempo_rapido/60)*60);

    printf("%s \n\n\n",tiempos_cada_vuelta);

    //"p" me va a dar la cantidad de muestras que tiene la vuelta rápida.
    //Tengo que hacer un algoritmo que me haga que TODAS las vueltas tengan "p" de muestras.
    //el nro "p" a pesar de ser un entero, representa en fondo una posición de GPS
    p=position_index[nro_vuelta_rapida+1]-position_index[nro_vuelta_rapida];

    //Separo la vuelta rápida

    vuelta_rapida =  (sSpilbaDataRow*) malloc (p * sizeof(sSpilbaDataRow) );

    for(i=position_index[nro_vuelta_rapida], j=0; i<position_index[nro_vuelta_rapida+1];i++)
    {
        vuelta_rapida[j] = datosSpilba[i];
        j++;
    }


    //barro todas las vueltas menos las rápida
    //for (i=110;i<120;i++)
    for (i=1;i<total_vueltas-1;i++)
    {
        //sprintf(stVuelta,"c:/Users/CoreQuad/Downloads/datos_C/vuelta_%i.txt",i+1);
        sprintf(stVuelta,"vuelta_%i.txt",i+1);
        fp_out = fopen (stVuelta, "w+");
        fprintf(fp_out,
                        "vuelta\t"
                        "index\t"
                        "sats\t"
                        "time\t"
                        "lat\t"
                        "lon\t"
                        "velocity_kmh\t"
                        "heading\t"
                        "height\t"

#ifdef MOURAS
                        "Lat_accel\t"
                        "Long_accel\t"
                        "Vert_accel\t"
                        "Gyro_x\t"
                        "Gyro_y\t"
                        "Gyro_z\n"
#endif
#ifdef TERMAS
                        "Vert_accel\t"
                        "Gyro_x\n"
#endif
#ifdef BAIRES
                        "Lat_accel\t"
                        "Long_accel\t"
                        "Vert_accel\t"
                        "Temp\t"
                        "Vbatt\t"
                        "RPM\n"
#endif
                        );


        if (i==nro_vuelta_rapida)
        {
            printf("Vuelta de referencia: %i (tiene %i muestras) \n", i+1, p);
            for(n=0; n<p; n++)
                //fprintf(fp_out,"%i,%i,%f,%f,%f,%f,%f,%f,%f,%f,%f,%f,%f,%f,%f\n",
#ifndef TERMAS
                fprintf(fp_out,"%i\t%i\t%.0f\t%.1f\t%.4f\t%.4f\t%.3f\t%.2f\t%.4f\t%.4f\t%.4f\t%.4f\t%.4f\t%.4f\t%.4f\n",
#endif
#ifdef TERMAS
                fprintf(fp_out,"%i\t%i\t%.0f\t%.1f\t%.4f\t%.4f\t%.3f\t%.2f\t%.4f\t%.4f\t%.4f\n",
#endif

                                                i+1,
                                                n,
                                                vuelta_rapida[n].sats,
                                                vuelta_rapida[n].time,
                                                vuelta_rapida[n].lat,
                                                vuelta_rapida[n].lon,
                                                vuelta_rapida[n].velocity_kmh,
                                                vuelta_rapida[n].heading,
                                                vuelta_rapida[n].height,
#ifdef MOURAS
                                                vuelta_rapida[n].Lat_accel,
                                                vuelta_rapida[n].Long_accel,
                                                vuelta_rapida[n].Vert_accel,
                                                vuelta_rapida[n].Gyro_x,
                                                vuelta_rapida[n].Gyro_y,
                                                vuelta_rapida[n].Gyro_z
#endif
#ifdef TERMAS
                                                vuelta_rapida[n].Vert_accel,
                                                vuelta_rapida[n].Gyro_x
#endif
#ifdef BAIRES
                                                vuelta_rapida[n].Lat_accel,
                                                vuelta_rapida[n].Long_accel,
                                                vuelta_rapida[n].Vert_accel,
                                                vuelta_rapida[n].Temp,
                                                vuelta_rapida[n].Vbatt,
                                                vuelta_rapida[n].RPM
#endif
                                                );
        }

        if (i!=nro_vuelta_rapida)
        {
            //"q" me va a dar la cantidad de muestras de cada vuelta,
            //¡PERO yo necesito que sean de largo "p"
            q=position_index[i+1]-position_index[i];
            vuelta_original =  (sSpilbaDataRow*) malloc (q * sizeof(sSpilbaDataRow) );

            //Separo cada vuelta
            for(n=position_index[i], j=0; n<position_index[i+1];n++)
            {
              vuelta_original[j] = datosSpilba[n];
              j++;
            }

            vuelta_al =  (sSpilbaDataRow*) malloc (p * sizeof(sSpilbaDataRow) );
            if (vuelta_al  == NULL)
            {
                perror ("Error");
            }

            printf("Analizando vuelta: %i (tiene %i muestras, quiero que sea de %i muestras)\n", i+1, q, p);

            //Entonces hago un resampleo falso
            vuelta_al = resampleo_falso(vuelta_original,vuelta_rapida,p,q);

            for(n=0; n<p; n++)
                //fprintf(fp_out,"%i,%i,%.0f,%.1f,%.4f,%.4f,%.3f,%.2f,%.4f,%.4f,%.4f,%.4f,%.4f,%.4f,%.4f\n",
#ifndef TERMAS
                fprintf(fp_out,"%i\t%i\t%.0f\t%.1f\t%.4f\t%.4f\t%.3f\t%.2f\t%.4f\t%.4f\t%.4f\t%.4f\t%.4f\t%.4f\t%.4f\n",
#endif
#ifdef TERMAS
                fprintf(fp_out,"%i\t%i\t%.0f\t%.1f\t%.4f\t%.4f\t%.3f\t%.2f\t%.4f\t%.4f\t%.4f\n",
#endif
                                    i+1,
                                    n,
                                    vuelta_al[n].sats,
                                    vuelta_al[n].time,
                                    vuelta_al[n].lat,
                                    vuelta_al[n].lon,
                                    vuelta_al[n].velocity_kmh,
                                    vuelta_al[n].heading,
                                    vuelta_al[n].height,
#ifdef MOURAS
                                    vuelta_al[n].Lat_accel,
                                    vuelta_al[n].Long_accel,
                                    vuelta_al[n].Vert_accel,
                                    vuelta_al[n].Gyro_x,
                                    vuelta_al[n].Gyro_y,
                                    vuelta_al[n].Gyro_z

#endif
#ifdef TERMAS
                                    vuelta_al[n].Vert_accel,
                                    vuelta_al[n].Gyro_x
#endif
#ifdef BAIRES
                                    vuelta_al[n].Lat_accel,
                                    vuelta_al[n].Long_accel,
                                    vuelta_al[n].Vert_accel,
                                    vuelta_al[n].Temp,
                                    vuelta_al[n].Vbatt,
                                    vuelta_al[n].RPM
#endif

                                    );
        }

        free(vuelta_original);
        free(vuelta_al);
        fclose(fp_out);
    }

    
    printf("Libero memoria\n");

    free(datosSpilba);
    free(position_index);

    free(vuelta_rapida);
    free(lon);
    free(lat);
    free(velocity_ms);
    free(direccion);
    free(delta_distancia);
    free(delta_tiempo);
    free(tiempo_total_seg);
    free(cruze_x);
    free(cruze_y);
    free(marker_spilba_lat);
    free(marker_spilba_long);
    free(tiempos_cada_vuelta_seg);
                        
    printf("FIN DEL PROGRAMA\n");

    return 0;

}

