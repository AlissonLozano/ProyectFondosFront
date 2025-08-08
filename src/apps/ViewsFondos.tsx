import classes from "./ViewsFondos.module.css";

const productos = [
  {
    id: 1,
    nombre: "dddddddd",
    monto_minimo: 1000,
    categoria: "gggg",
  },
  {
    id: 2,
    nombre: "dddddddd",
    monto_minimo: 1000,
    categoria: "gggg",
  },
  {
    id: 3,
    nombre: "dddddddd",
    monto_minimo: 1000,
    categoria: "gggg",
  },
];

const productosNuevos = [
  {
    id: 1,
    nombre: "dddddddd",
    monto_minimo: 1000,
    categoria: "gggg",
  },
  {
    id: 2,
    nombre: "dddddddd",
    monto_minimo: 1000,
    categoria: "gggg",
  },
  {
    id: 3,
    nombre: "dddddddd",
    monto_minimo: 1000,
    categoria: "gggg",
  },
];

const ViewsFondos = () => {
  return (
    <div>
      <label>Administar Fondos</label>
      <div className={classes.containerProductFather}>
        <div className={classes.containerProduct}>
          {productos.map(({ id, nombre, monto_minimo, categoria }) => {
            return (
              <div className={classes.productInd} key={id}>
                <label className={classes.labelCategory}>
                  <strong>{categoria}</strong>
                </label>
                <label className={classes.productInd_label}>{nombre}</label>
                <label>{`COP $${monto_minimo}`}</label>
                <button className={classes.productInd_button_cancel}>
                  Anular Suscripción
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <br></br>
      <div className={classes.containerProductFather}>
        <div className={classes.containerProduct}>
          {productosNuevos.map(({ id, nombre, monto_minimo, categoria }) => {
            return (
              <div className={classes.productInd} key={id}>
                <label className={classes.labelCategory}>
                  <strong>{categoria}</strong>
                </label>
                <label className={classes.productInd_label}>{nombre}</label>
                <label>{`COP $${monto_minimo}`}</label>
                <button className={classes.productInd_button_new}>
                  Suscribirse
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ViewsFondos;
