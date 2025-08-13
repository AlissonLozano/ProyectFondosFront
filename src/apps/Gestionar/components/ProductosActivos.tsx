import { Fragment, useCallback, useState } from "react";
import { formatMoney } from "../../../components/InputsCustom/InputCustomMoney";
import type { TypeProductos } from "../utils";
import classes from "../ViewsFondos.module.css";
import WindowCustom from "../../../components/WindowCustom";
import fetchApp from "../../../utils/fetchApp";
import { toastContentPending } from "../../../utils/toastContent";
import { useContextUser } from "../../../context/useContextUser";
import { useNavigate } from "react-router-dom";

export type TypePaso = "ninguno" | "resumen" | "aprobada";

export type TypeResultCancelar = {
  id_movimiento: number;
};

const PeticionCancelar = async (
  id_user: number,
  id_producto: number
): Promise<TypeResultCancelar> => {
  const url = import.meta.env.VITE_APP_URL_GESTIONAR;
  const body = {
    id_user,
    id_producto,
  };

  const response = await fetchApp(url, "PUT", {}, body);
  const status = response?.status ?? false;
  if (!status) {
    throw new Error(response?.msg ?? "Error al consumir el servicio");
  }

  return {
    id_movimiento: response?.obj?.id_movimiento,
  };
};

type PropsProductosActivos = {
  productosActivos: TypeProductos[];
};

const ProductosActivos = ({ productosActivos }: PropsProductosActivos) => {
  const user = useContextUser();
  const helperNavigate = useNavigate();
  const [paso, setPaso] = useState<TypePaso>("ninguno");
  const [showWindow, setShowWindow] = useState<boolean>(false);
  const [productoElegido, setProductoElegido] = useState<TypeProductos | null>(
    null
  );
  const [idMovimiento, setIdMovimiento] = useState<number | null>(null);
  const [loanding, setLoanding] = useState<boolean>(false);

  const onClickAceptar = useCallback(() => {
    if (!productoElegido) return;
    toastContentPending(
      PeticionCancelar(user.id_user, productoElegido?.id_producto),
      {
        render: () => {
          setLoanding(true);
          return "Procesando";
        },
      },
      {
        render: ({ data }) => {
          setIdMovimiento(data.id_movimiento);
          setPaso("aprobada");
          setLoanding(false);
          return "Transacción Aprobada";
        },
      },
      {
        render: ({ data: error }) => {
          setPaso("ninguno");
          setShowWindow(false);
          setLoanding(false);
          return error?.message ?? "Transacción Rechazada";
        },
      }
    );
  }, [productoElegido, user.id_user]);

  return (
    <Fragment>
      {loanding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-b-black border-t-transparent"></div>
        </div>
      )}

      <div className={classes.containerProductFather}>
        <div className={classes.containerProduct}>
          {productosActivos.map(
            ({ id_producto, nombre, valor, categoria }: TypeProductos) => {
              return (
                <div className={classes.productInd} key={id_producto}>
                  <label className={classes.labelCategory}>
                    <strong>{categoria}</strong>
                  </label>
                  <label className={classes.productInd_label}>{nombre}</label>
                  <label>{`COP ${formatMoney.format(valor)}`}</label>
                  <button
                    className={classes.productInd_button_cancel}
                    onClick={() => {
                      setShowWindow(true);
                      setProductoElegido({
                        id_producto,
                        nombre,
                        valor,
                        categoria,
                      });
                      setPaso("resumen");
                    }}
                  >
                    Anular Suscripción
                  </button>
                </div>
              );
            }
          )}
        </div>
      </div>
      {productoElegido && (
        <WindowCustom
          show={showWindow}
          handleClose={() => {
            setShowWindow(false);
            if (paso == "aprobada") helperNavigate("../");
          }}
        >
          {paso == "resumen" && (
            <div className="grid grid-flow-row auto-rows-max gap-4 place-items-center text-center">
              <h2 className="text-2xl font-semibold">
                ¿Resumen de la suscripción?
              </h2>
              <h2 className="grid grid-flow-col auto-cols-fr gap-6">
                <strong className="justify-self-end">Nombre:</strong>
                <p className="justify-self-start whitespace-pre-wrap break-all">
                  {productoElegido.nombre}
                </p>
              </h2>
              <h2 className="grid grid-flow-col auto-cols-fr gap-6">
                <strong className="justify-self-end">Categoria:</strong>
                <p className="justify-self-start whitespace-pre-wrap break-all">
                  {productoElegido.categoria}
                </p>
              </h2>
              <h2 className="grid grid-flow-col auto-cols-fr gap-6">
                <strong className="justify-self-end">Valor Actual:</strong>
                <p className="justify-self-start whitespace-pre-wrap break-all">
                  {`COP ${formatMoney.format(productoElegido.valor)}`}
                </p>
              </h2>
              <div className="flex gap-7">
                <button
                  className={classes.buttonAceptar}
                  onClick={onClickAceptar}
                >
                  Aceptar
                </button>
                <button
                  className={classes.buttonCancelar}
                  onClick={() => setShowWindow(false)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {paso == "aprobada" && (
            <div className="grid grid-flow-row auto-rows-max gap-4 place-items-center text-center">
              <h2 className="text-2xl font-semibold">Transacción Aprobada</h2>
              <h2 className="grid grid-flow-col auto-cols-fr gap-6">
                <strong className="justify-self-end">Valor Transacción:</strong>
                <p className="justify-self-start whitespace-pre-wrap break-all">
                  {`COP ${formatMoney.format(productoElegido.valor)}`}
                </p>
              </h2>

              <h2 className="grid grid-flow-col auto-cols-fr gap-6">
                <strong className="justify-self-end">
                  Número Transacción:
                </strong>
                <p className="justify-self-start whitespace-pre-wrap break-all">
                  {idMovimiento}
                </p>
              </h2>
              <button
                className={classes.buttonAceptar}
                onClick={() => {
                  setShowWindow(false);
                  helperNavigate("../");
                }}
              >
                Cerrar
              </button>
            </div>
          )}
        </WindowCustom>
      )}
    </Fragment>
  );
};

export default ProductosActivos;
