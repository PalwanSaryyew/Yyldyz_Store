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
   message_id: number;
}
interface ChatState {
   userId: number;
   username?: string;
   messageIds: number[];
   calling?: boolean;
}

interface TransferState {
   recieverID: number;
   senderWalNum: string;
   recieverWalNum: string;
   amount: number;
   currency: string;
   messageId: number;
}
interface BroadcastState {
   message: string;
   message_id: number;
}
interface CheckState {
   messageId: number;
}
interface RedeemCodeState {
   messageId: number;
}

// *** YENİ BotSessionData YAPISI ***
export interface BotSessionData {
   // user states
   transferStates: Record<number, TransferState>;
   signupState: Record<number, SignupState>;
   sumAddStates: Record<number, SumAddState>;
   chatStates: Record<number, ChatState>;
   broadcastStates: Record<number, BroadcastState>;
   checkStates: Record<number, CheckState>;
   redeemCodeState: Record<number, RedeemCodeState>;
   reasonStates: Record<number, ReasonState>; // none cleareable
   // other states
   ordrMsgEdtStts: Record<number, OrdrMsgEdtSt>;
   // Tek bir global bot durumunu takip etmek için (opsiyonel)
   // currentBotState?: 'idle' | 'broadcasting' | 'checking';
}
export type MyContext = Context & SessionFlavor<BotSessionData>;

export const bot = new Bot<MyContext>(
   process.env.BOT_TOKEN || "YOUR_FALLBACK_TOKEN",
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
         signupState: {},
         redeemCodeState: {},
      }),
      // ÖNEMLİ: Her zaman aynı session key'ini döndürerek tüm verileri tek bir oturum altında topluyoruz.
      // Bu, ctx.session'ın her zaman aynı global durumu temsil etmesini sağlar.
      getSessionKey: (ctx) => "GLOBAL_BOT_STATE_KEY", // Her zaman aynı sabit string
      storage: new SingleFileAdapter(GLOBAL_STATE_FILE), // Kendi adaptörümüzü kullanmaya devam
   }),
);
