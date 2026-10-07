import { redirect } from "next/navigation"

type Props = {
  params: Promise<{ slug: string }>
}

export default async function PortfolioSlugRedirect({ params }: Props) {
  const { slug } = await params
  redirect(`/work/${slug}`)
}
