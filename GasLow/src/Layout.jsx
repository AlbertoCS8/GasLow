import FondoAnimado from "./FondoAnimado";
import "./Layout.css";

export default function Layout({ children }) {
  return (
    <>
      <FondoAnimado />
      <div className="app-content">
        {children}
      </div>
    </>
  );
}