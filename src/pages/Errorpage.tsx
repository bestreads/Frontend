import { Link } from "react-router"
import { Button } from "@/components/ui/button"
import logo from "@/assets/images/logo_text_untereinander.svg"


function Error() {
  return (
    <div className="flex h-full items-center p-6 flex-col md:flex-row">
      <div className="w-1/2 flex justify-center items-center">
        <img src={logo} alt="bestreads logo" className="w-3/4 max-w-md" />
      </div>

      <div className="w-1/2 flex flex-col justify-center items-start px-8">
        <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-3xl font-semibold mb-4">
          Entschuldigung, das hätte nicht passieren dürfen!
        </h2>
        <p className="text-lg mb-6">
          Ups! Die Seite, die du suchst, existiert nicht.
        </p>
        <Button asChild>
          <Link to="/">Zurück zur Startseite</Link>
        </Button>
      </div>
    </div>
  )
}

export default Error