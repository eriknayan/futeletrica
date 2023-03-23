import { formatDate } from "@/formatters/date_formatter";
import { GetServerSidePropsContext } from "next";
import { Button } from "@/components/button";
import Link from "next/link";
import { Header } from "@/components/header";
import { PageHead } from "@/components/page_head";
import { ssg } from "@/server/utils/ssg_helper";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { validateRouterQueryToNumber } from "@/utils/validate_router_query";

export default function Home() {
  const router = useRouter();
  const gameIdNumber = validateRouterQueryToNumber(router.query.gameId);

  const gameQuery = trpc.game.findById.useQuery(gameIdNumber);
  const gameResultsQuery = trpc.game.gameResults.findAllByGameId.useQuery(gameIdNumber);

  if (!gameQuery.data || !gameResultsQuery.data) {
    throw "Data not prefetched from SSG";
  }

  return (
    <>
      <PageHead description={`Confira os dados do jogo do dia ${formatDate(gameQuery.data.game_date)}`} />
      <main className="flex h-screen flex-col bg-neutral-900">
        <Header />
        <div className="flex flex-col items-center">
          <h2 className="mb-4 text-xl font-bold text-yellow">Jogo do dia {formatDate(gameQuery.data.game_date)}</h2>
          <Button>
            <Link href={`/jogo/${gameQuery.data.id}/escalacao`}>Escalação</Link>
          </Button>
          {gameResultsQuery.data.length > 0 && (
            <Button>
              <Link href={`/jogo/${gameQuery.data.id}/resultados`}>Resultados</Link>
            </Button>
          )}
        </div>
      </main>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const gameId = validateRouterQueryToNumber(context.query.gameId);

  await Promise.all([ssg.game.findById.prefetch(gameId), ssg.game.gameResults.findAllByGameId.prefetch(gameId)]);

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
  };
}
