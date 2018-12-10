#ifndef POSITIONINDEX_SPILBA_H_
#define POSITIONINDEX_SPILBA_H_

#define PI 3.14159265358979323846
#define ER 6371000 //#Er=earthRadius('meters');

//#define LARGO 8655 //sacado a mano
#define MAX_STRING_SIZE    6
#define MAX_NUMBER_STRINGS 15

//#define MOURAS
//#define BAIRES
#define TERMAS

//#define NELEMS(x)  (sizeof(x) / sizeof((x)[0]))



typedef struct {
  double sats;
  double time;
  double lat;
  double lon;
  double velocity_kmh;
  double heading;
  double height;
#ifdef TERMAS
  double Vert_accel;
  double Gyro_x;
#endif

#ifdef MOURAS
  double Lat_accel;
  double Long_accel;
  double Vert_accel;
  double Gyro_x;
  double Gyro_y;
  double Gyro_z;
#endif

#ifdef BAIRES
  double Lat_accel;
  double Long_accel;
  double Vert_accel;
  double Temp;
  double Vbatt;
  double RPM;
  double Marcha;
  double Signal;
  double Receiver;
  double Retries;
#endif

} sSpilbaDataRow;

#endif
