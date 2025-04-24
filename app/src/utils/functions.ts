

export function rndmNmrGnrtr(l: number): string {
   let result = "";
   for (let i = 0; i < l; i++) {
      result += Math.floor(Math.random() * 10);
   }
   return result;
}


