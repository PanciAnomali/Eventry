import { redirect } from "next/navigation";

export default function Home() {
  // Langsung lempar user ke halaman dashboard/login
  redirect("/login"); 
}
