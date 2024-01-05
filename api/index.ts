import type { Api } from "server";
export { cst } from "server";

const createHandler = (base: string): any => {
  return new Proxy(() => {}, {
    get(target, p, receiver) {
      return createHandler(`${base}/${p as string}`);
    },
    apply(target, thisArg, argArray) {
      return fetch(base, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(argArray),
      }).then((res) => res.json());
    },
  });
};
type Promisify<T> = {
  [K in keyof T]: T[K] extends (...params: infer P) => infer R
    ? (...params: P) => Promise<Awaited<R>>
    : Promisify<T[K]>;
};

const api = createHandler("/api") as Promisify<Api>;
export { api };
