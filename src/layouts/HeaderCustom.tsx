import { useEffect, useState } from "react";
import { useContextUser } from "../context/useContextUser";
import classes from "./HeaderCustom.module.css";
import { useLocation, useNavigate } from "react-router-dom";

const opciones = ["Inicio", "Fondos", "Movimientos"];

const HeaderCustom = () => {
  const user = useContextUser();
  const helperNavigate = useNavigate();
  const location = useLocation();
  const [activo, setActivo] = useState("Inicio");

  useEffect(() => {
    if (location.pathname === "/administracion-fondos") setActivo("Fondos");
    if (location.pathname === "/movimientos") setActivo("Movimientos");
    if (location.pathname === "/") setActivo("Inicio");
  }, [location.pathname]);

  return (
    <div>
      <div className={classes.containerHeader}>
        <img
          width={"150px"}
          src={
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgxJJ__bIkzwfKWV4DQFxpU2b7O-cWoXPYgw&s"
          }
          alt="Logo de la empresa"
        />

        <div className="flex justify-center gap-16 bg-black text-white py-4">
          {opciones.map((item) => (
            <button
              key={item}
              onClick={() => {
                switch (item) {
                  case "Inicio":
                    helperNavigate("../");
                    break;
                  case "Movimientos":
                    helperNavigate("/movimientos");
                    break;
                  case "Fondos":
                    helperNavigate("/administracion-fondos");
                    break;
                }
              }}
              className={`pb-1 transition-colors ${
                activo === item
                  ? "border-b-4 border-white"
                  : "border-b-4 border-transparent hover:border-gray-500"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className={classes.containerUser}>
          <label className={classes.labelUser}>{user.name}</label>
        </div>
      </div>
      {activo !== "Inicio" && (
        <button
          onClick={() => {
            helperNavigate("../");
            setActivo("Inicio");
          }}
          className="flex items-center gap-2 mt-3 ml-3 px-4 py-2 bg-black hover:bg-gray-700 rounded-lg text-white font-medium transition"
        >
          ← Atrás
        </button>
      )}
    </div>
  );
};

export default HeaderCustom;
