import { useLocation } from "react-router-dom";

//FRAGMENT ********************* CSS *********************************
import classes from "./HeaderCustom.module.css";

const HeaderCustom = () => {
  return (
    <div className={classes.containerHeader}>
      <div className={classes.containerImage}>
        <img
          width={"auto"}
          height={"150px"}
          src={
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgxJJ__bIkzwfKWV4DQFxpU2b7O-cWoXPYgw&s"
          }
          alt="Logo de la empresa"
        />
      </div>
      <div className={classes.containerSeccion}>
        <label>Inicio</label>
        <label>Fondos</label>
        <label>Movimientos</label>
      </div>
      <div className={classes.containerUser}>
        <label className={classes.labelUser}>Alisson</label>
      </div>
    </div>
  );
};

export default HeaderCustom;
