import { redirect } from "next/navigation";

export default async function HomePage() {
  redirect('/chat')
  return <h1></h1>;
}