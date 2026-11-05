import { useCallback, useEffect, useRef, useState } from "react";

// Executa uma função assíncrona sempre que as dependências mudam,
// descartando respostas antigas que chegam fora de ordem.
export function useAsync(fn, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  const callId = useRef(0);

  const run = useCallback(() => {
    const id = ++callId.current;
    setState((s) => ({ ...s, loading: true, error: null }));
    fn()
      .then((data) => id === callId.current && setState({ data, loading: false, error: null }))
      .catch((error) => id === callId.current && setState({ data: null, loading: false, error }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    run();
  }, [run]);

  return { ...state, reload: run };
}
