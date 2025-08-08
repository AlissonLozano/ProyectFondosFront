import { Link } from "react-router-dom";
import classes from "./ViewsInicio.module.css";
import { ListRoutesModule } from "../routes/subRoutes";

const ViewsInicio = () => {
  return (
    <div>
      <div className={classes.containerUser}>
        <div className={classes.containerLeft}>
          <div className={classes.divTarjeta}>
            <label>Mi Cuenta</label>
          </div>
        </div>
        <div className={classes.containerRigth}>
          <img
            className={classes.imgCustom}
            src={
              "https://s1.significados.com/foto/tipos-de-familia-nuclear.jpg?class=article"
            }
            alt="Logo de la empresa"
          />
        </div>
      </div>
      <div className={classes.containerSeccionFather}>
        <div className={classes.containerSeccion}>
          {ListRoutesModule.map(({ link, label, logo, description }) => {
            return (
              <Link to={link} key={link}>
                <div className={classes.seccionInd}>
                  <label>{label}</label>
                  {logo}
                  <p>{description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ViewsInicio;
