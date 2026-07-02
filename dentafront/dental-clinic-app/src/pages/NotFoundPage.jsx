import { Link } from "react-router-dom"
import PageWrapper from "../components/PageWrapper"
import { Button } from "../components/ui"

export default function NotFoundPage() {
  return (
    <PageWrapper title="Stranica nije pronađena">
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
        <span className="font-heading text-7xl font-bold text-primary">404</span>
        <h1 className="mt-4 font-heading text-2xl font-semibold text-foreground">
          Stranica nije pronađena
        </h1>
        <p className="mt-2 text-muted-foreground">
          Žao nam je, tražena stranica ne postoji ili je premeštena.
        </p>
        <Link to="/" className="mt-6">
          <Button>Nazad na početnu</Button>
        </Link>
      </div>
    </PageWrapper>
  )
}
