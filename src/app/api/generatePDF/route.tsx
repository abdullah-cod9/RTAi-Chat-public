/* eslint-disable jsx-a11y/alt-text */
import { getCurrentUser, publicIdCache } from "@/app/actions/caches/action";
import { getInitialMessage } from "@/app/actions/db/actions";
import {
  Page,
  Text,
  View,
  Document,
  renderToStream,
  Font,
  Image,
} from "@react-pdf/renderer";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { createTw } from "react-pdf-tailwind";

Font.register({
  family: "NotoSans",
  fonts: [
    { src: "public//fonts/NotoSans/NotoSansArabic-Regular.ttf" }, // دعم العربية بشكل جيد
    { src: "public//fonts/NotoSans/NotoSans-Regular.ttf" }, // اللغات اللاتينية والآسيوية
    { src: "public//fonts/NotoSans/NotoSansSC-Regular.ttf" }, // دعم الصينية واليابانية والكورية
  ],
});
const tw = createTw({
  theme: {
    extend: {
      fontFamily: {
        NotoSans: ["NotoSans", "sans-serif"],
      },
      colors: {
        custom: "cornflowerblue",
      },
    },
  },
});
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "60 s"),
});

export async function POST(req: Request) {
  const { chatId }: { chatId: string } =
    await req.json();
    const { user } = await getCurrentUser();
if (!user) {
  redirect('/auth/403')
}
const publicId = await publicIdCache(user.id)
  const identifier = publicId;
  const { success, reset } = await ratelimit.limit(identifier);
  if (!success) {
    const now = Date.now();
    const retryAfter = Math.floor((reset - now) / 1000);
    return new NextResponse(
      `⏳ You have exceeded the chat history request limit. Please wait ${retryAfter} seconds before trying again.`,
      {
        status: 429,
        headers: {
          ["retry-after"]: `${retryAfter}`,
        },
      },
    );
  }


  const message = await getInitialMessage(chatId);
  // Create Document Component
  const MyDocument = () => (
    <Document>
      <Page size="A4" style={tw("p-4 flex flex-row flex-wrap gap-4")} break>
        {message.map((m) => {
          const isCurrentUser = m.publicId === publicId && m.role !== "assistant";
      
          return (
            <View
              key={m.id}
              style={{
                ...tw("flex items-start gap-2 p-2 rounded-md w-full"),
                ...(isCurrentUser
                  ? tw("justify-start flex-row-reverse")
                  : tw("justify-start flex-row")),
              }}
              wrap={false}
            >
              <Image
                cache
                src={
                  m.role === "assistant"
                    ? "https://zzpjgqoarfqxohaylkvr.supabase.co/storage/v1/object/public/Public_assets/images/ai-platform-svgrepo-com.png"
                    : m.avatarUrl
                }
                style={tw("w-8 h-auto rounded-full")}
              />
              <View
                style={{
                  ...tw("flex flex-col items-end rounded-lg p-2 w-auto"),
                  ...(isCurrentUser
                    ? tw("items-end bg-blue-500 text-white")
                    : tw("items-start bg-gray-200 text-black")),
                }}
              >
                <Text style={tw("font-NotoSans text-sm")}>
                  {m.role === "assistant" ? m.model : m.username}
                </Text>
                {m.replyToMessageId && m.replyToMessage && (
                  <View
                    style={tw(
                      "flex flex-col text-sm font-NotoSans mt-1 max-w-2xl bg-slate-500 p-1",
                    )}
                  >
                    <Text>
                      {m.role === "assistant"
                        ? m.model
                        : m.username}
                    </Text>
                    <Text>{m.replyToMessage[0].text}</Text>
                  </View>
                )}

                <Text style={tw("text-sm font-NotoSans mt-1 max-w-2xl")}>
                  {m.parts[0].type === 'text' ? m.parts[0].text : ''}
                </Text>
              </View>
            </View>
          );
        })}
      </Page>
    </Document>
  );

  const stream = await renderToStream(<MyDocument />);

  // Return the PDF as a stream with the appropriate headers
  return new Response(stream as unknown as ReadableStream, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="document.pdf"',
    },
  });
}
