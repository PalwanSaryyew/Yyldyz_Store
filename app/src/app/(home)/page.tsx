import ClientRedirectHandler from "@/components/telegram/ClientRedirectHandler";

export default function HomePage() {
   return (
      <div className="text-white flex items-center justify-center h-[75vh] text-lg">
         {/* We call the client component that handles the routing logic */}
         <ClientRedirectHandler />
      </div>
   );
}
