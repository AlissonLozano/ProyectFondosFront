import { useContextUser } from "../context/useContextUser";
import classes from "./HeaderCustom.module.css";

const HeaderCustom = () => {
  const user = useContextUser();
  return (
    <div className={classes.containerHeader}>
      <img
        width={"150px"}
        src={
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgxJJ__bIkzwfKWV4DQFxpU2b7O-cWoXPYgw&s"
        }
        alt="Logo de la empresa"
      />
      <div className={classes.containerSeccion}>
        <label>Inicio</label>
        <label>Fondos</label>
        <label>Movimientos</label>
      </div>
      <div className={classes.containerUser}>
        <label className={classes.labelUser}>{user.name}</label>
      </div>
    </div>
  );
};

export default HeaderCustom;
