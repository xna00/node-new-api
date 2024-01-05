import { api, cst } from "api";
import { useState } from "react";
import { createRoot } from "react-dom/client";

const App = () => {
  const [count, setCount] = useState(cst.version);
  return (
    <div>
      <button onClick={() => api.add(count).then((res) => setCount(res.count))}>
        {count}
      </button>
    </div>
  );
};
createRoot(document.getElementById("root")!).render(<App />);
