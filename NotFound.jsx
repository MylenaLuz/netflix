import { Link } from "react-router-dom";
import { EmptyState } from "../components/StateView";

export default function NotFound() {
  return (
    <div className="page page--pad-top">
      <EmptyState title="Página não encontrada" message="Esse endereço não existe no Sessão."
        action={<Link className="btn btn--ghost" to="/">Voltar ao início</Link>} />
    </div>
  );
}
