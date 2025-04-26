export const webApp = async () => {
   const WebApp = (await import("@twa-dev/sdk")).default;

   await WebApp.ready()
   ;
   /* WebApp.setHeaderColor("#60A5FA");
   WebApp.setBottomBarColor("#60A5FA");
   WebApp.setBackgroundColor("#60A5FA"); */

   return WebApp;
};
