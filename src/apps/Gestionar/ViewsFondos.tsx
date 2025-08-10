/* eslint @typescript-eslint/no-explicit-any: "off" */
import { useCallback, useEffect, useState } from "react";
import classes from "./ViewsFondos.module.css";
import { useContextUser } from "../../context/useContextUser";
import fetchApp from "../../utils/fetchApp";
import { toastContentError } from "../../utils/toastContent";
import { formatMoney } from "../../components/InputsCustom/InputCustomMoney";

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

export type TypeProduct = "activos" | "disponibles";
export type TypeProductos = {
  categoria: string;
  id: number;
  nombre: string;
  valor: number;
};

export type TypeResultProductos = {
  productos: TypeProductos[];
  page_next: boolean;
};

const ViewsFondos = () => {
  const user = useContextUser();
  const [productosActivos, setProductosActivos] = useState<TypeProductos[]>([]);
  const [productosDisponibles, setProductosDisponibles] = useState<
    TypeProductos[]
  >([]);

  const PeticionConsultar = useCallback(
    async (tipo: TypeProduct): Promise<TypeResultProductos> => {
      const url = import.meta.env.VITE_APP_URL_GESTIONAR;
      const params = {
        id_user: user.id_user,
        tipo: tipo,
      };

      const response = await fetchApp(url, "GET", params, {});
      const status = response?.status ?? false;
      if (!status) {
        throw new Error(response?.msg ?? "Error al consumir el servicio");
      }
      const productos_backend = response?.obj?.productos ?? [];
      const productos = productos_backend.map(
        (prod: { [key: string]: string | number }) => ({
          categoria: prod?.Categoria,
          id: Number(prod?.id),
          nombre: prod?.Nombre,
          valor:
            tipo == "activos" ? prod?.valor : prod?.Monto_minimo_vinculacion,
        })
      );
      return {
        productos,
        page_next: response?.obj?.page_next ?? false,
      };
    },
    [user]
  );

  useEffect(() => {
    PeticionConsultar("activos")
      .then((result: TypeResultProductos) => {
        setProductosActivos(result?.productos);
      })
      .catch((error: any) => {
        toastContentError(error?.message, 5000, {
          toastId: "error_backend_productos_activos",
        });
      });
  }, [PeticionConsultar]);

  useEffect(() => {
    PeticionConsultar("disponibles")
      .then((result: TypeResultProductos) => {
        setProductosDisponibles(result?.productos);
      })
      .catch((error: any) => {
        toastContentError(error?.message, 5000, {
          toastId: "error_backend_productos_disponibles",
        });
      });
  }, [PeticionConsultar]);

  return (
    <div>
      <label>Administar Fondos</label>
      <div className={classes.containerProductFather}>
        <div className={classes.containerProduct}>
          {productosActivos.map(
            ({ id, nombre, valor, categoria }: TypeProductos) => {
              return (
                <div className={classes.productInd} key={id}>
                  <label className={classes.labelCategory}>
                    <strong>{categoria}</strong>
                  </label>
                  <label className={classes.productInd_label}>{nombre}</label>
                  <label>{`COP ${formatMoney.format(valor)}`}</label>
                  <button className={classes.productInd_button_cancel}>
                    Anular Suscripción
                  </button>
                </div>
              );
            }
          )}
        </div>
      </div>
      <br></br>
      <div className={classes.containerProductFather}>
        <div className={classes.containerProduct}>
          {productosDisponibles.map(
            ({ id, nombre, valor, categoria }: TypeProductos) => {
              return (
                <div className={classes.productInd} key={id}>
                  <label className={classes.labelCategory}>
                    <strong>{categoria}</strong>
                  </label>
                  <label className={classes.productInd_label}>{nombre}</label>
                  <label className={classes.productInd_label}>
                    Monto minimo de vinculación
                  </label>
                  <label>{`COP ${formatMoney.format(valor)}`}</label>
                  <button className={classes.productInd_button_new}>
                    Suscribirse
                  </button>
                </div>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewsFondos;
