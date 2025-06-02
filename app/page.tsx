import { GuestbookApp } from "@/components/guestbook-app";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/90 flex flex-col items-center">
      <div className="container max-w-4xl px-4 py-12">
        <GuestbookApp />
      </div>
    </div>
  );
}
