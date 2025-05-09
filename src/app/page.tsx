import { api, HydrateClient } from "~/trpc/server";
import { Nav, Header } from "./components";
export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });

  void api.post.getLatest.prefetch();

  return (
    <HydrateClient>
      <Header />
      <Nav />
      <main></main>
    </HydrateClient>
  );
}
