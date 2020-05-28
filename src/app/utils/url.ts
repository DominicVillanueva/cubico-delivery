 export class Url {

    // Desarrollo
    //  private static HOST = 'http://172.16.32.15';

    private static HOST_PROD = 'http://www.cubicowms.pe';
    private static PORT_DEVELOPER = '8087';
    private static ENDPOINTWCF = '/SGAA_WCF';
    public static URL_CUBICO: string = Url.HOST_PROD + ':' + Url.PORT_DEVELOPER + Url.ENDPOINTWCF;

     /**
      * @author DominicAybar 08-04-2020
      * @summary
      *  Obtener los iconos por defecto de google maps.
      */
     public static URL_MAP_ICON: string = 'http://maps.google.com/mapfiles/ms/icons/';
 }