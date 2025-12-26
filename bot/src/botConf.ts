// botConf.ts
import { PaymentMethod, SummUpdate, User } from "../prisma/prismaSett";
import { Bot, Context, SessionFlavor, session } from "grammy";
import * as path from "path";
import { SingleFileAdapter } from "./singleFileAdapter"; // Kendi adaptörümüzü kullanmaya devam

// Yeni yapıda, bu arayüzler doğrudan BotSessionData'nın içinde kullanılacak
interface SumAddState {
   mssgId: number;
   walNum: User["walNum"];
   crrncy: PaymentMethod | "";
   sum: SummUpdate["sum"];
}
interface OrdrMsgEdtSt {
   mssgIds: number[];
   clntMssgId: number;
}
interface ReasonState {
   orderId: number;
   client: string;
   mssgIds: number[];
   clntMssgId: number;
}
interface SignupState {
   nick: string | undefined;
   pass: string | undefined;
   message_id: number
}

// *** YENİ BotSessionData YAPISI ***
// Artık Record<number, ...> kullanmıyoruz, çünkü bunlar zaten tek bir objenin içindeki
// tüm kullanıcılara ait verileri tutacak şekilde global olacak.
export interface BotSessionData {
   transferStates: Record<
      number,
      {
         recieverID: number;
         senderWalNum: string;
         recieverWalNum: string;
         amount: number;
         currency: string;
         messageId: number;
      }
   >;
   // reasonStates'in eski Map yapısı: Map<any, any> idi.
   // Şimdi tek bir global obje olarak tutulacak.
   // Burada key'ler genellikle chat/user ID'leri olacak.
   reasonStates: Record<string, ReasonState>; // Eğer key'ler string ve değerler herhangi bir tipteyse

   signupState: Record<number, SignupState>; // Eğer key'ler string ve değerler herhangi bir tipteyse

   // sumAddStates'in eski Map yapısı: Map<number, SumAddState> idi.
   // Şimdi tek bir global obje olarak tutulacak.
   sumAddStates: Record<number, SumAddState>;

   // ordrMsgEdtStts'in eski Map yapısı: Map<number, OrdrMsgEdtSt> idi.
   // Şimdi tek bir global obje olarak tutulacak.
   ordrMsgEdtStts: Record<number, OrdrMsgEdtSt>;

   // chatStates'in eski Map yapısı: Map<number, { userId, username, messageIds, calling }> idi.
   // Şimdi tek bir global obje olarak tutulacak.
   chatStates: Record<
      number,
      {
         userId: number;
         username?: string;
         messageIds: number[];
         calling?: boolean;
      }
   >;

   // broadcastStates'in eski Map yapısı: Map<number, { message }> idi.
   // Şimdi tek bir global obje olarak tutulacak.
   broadcastStates: Record<
      number,
      {
         message: string;
         message_id: number;
      }
   >;

   // checkStates'in eski Map yapısı: Map<number, { messageId }> idi.
   // Şimdi tek bir global obje olarak tutulacak.
   checkStates: Record<
      number,
      {
         messageId: number;
      }
   >;

   paylaState: Record<
      number,
      {
         chestType: "NORMAL" | "PREMIUM";
         count: number;
      }
   >;

   // Tek bir global bot durumunu takip etmek için (opsiyonel)
   // currentBotState?: 'idle' | 'broadcasting' | 'checking';
}

// Oturum verilerini içeren özel bir Context tipi oluşturuyoruz
// DİKKAT: BotSessionData artık tek bir global oturumu temsil ettiği için,
// bu Context'i her zaman aynı "sanal" oturum anahtarıyla kullanmalıyız.
export type MyContext = Context & SessionFlavor<BotSessionData & { paylaState: Record<number, { chestType: "NORMAL" | "PREMIUM"; count: number; }> }>;

export const bot = new Bot<MyContext>(
   process.env.BOT_TOKEN || "YOUR_FALLBACK_TOKEN"
);
export const bot2 = new Bot(process.env.BOT_TOKEN_2 || "YOUR_FALLBACK_TOKEN");

// Tek bir global oturumun kaydedileceği dosya yolu
const GLOBAL_STATE_FILE = path.join(process.cwd(), "sessions", "states.json");

// Oturum middleware'ını bot'a ekliyoruz
bot.use(
   session<BotSessionData, MyContext>({
      // Initial değerler, tüm Map'lerin boş objeler olarak başladığı hali
      initial: (): BotSessionData => ({
         transferStates: {},
         reasonStates: {},
         sumAddStates: {},
         ordrMsgEdtStts: {},
         chatStates: {},
         broadcastStates: {},
         checkStates: {},
         signupState:{},
         paylaState: {}
      }),
      // ÖNEMLİ: Her zaman aynı session key'ini döndürerek tüm verileri tek bir oturum altında topluyoruz.
      // Bu, ctx.session'ın her zaman aynı global durumu temsil etmesini sağlar.
      getSessionKey: (ctx) => "GLOBAL_BOT_STATE_KEY", // Her zaman aynı sabit string
      storage: new SingleFileAdapter(GLOBAL_STATE_FILE), // Kendi adaptörümüzü kullanmaya devam
   })
);
