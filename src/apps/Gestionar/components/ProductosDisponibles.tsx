import {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import classes from "../ViewsFondos.module.css";
import { formatMoney } from "../../../components/InputsCustom/InputCustomMoney";
import { useContextUser } from "../../../context/useContextUser";
import type { TypeProductos } from "../utils";
import WindowCustom from "../../../components/WindowCustom";
import fetchApp from "../../../utils/fetchApp";
import { toastContentPending } from "../../../utils/toastContent";
import { useNavigate } from "react-router-dom";

export type TypePaso = "ninguno" | "resumen" | "aprobada";

type PropsProductosDisponibles = {
  productosDisponibles: TypeProductos[];
};

export type TypeResultSuscribirse = {
  id_movimiento: number;
};

const PeticionSuscribirse = async (
  id_user: number,
  id_producto: number,
  valor: number,
  notificacion: string
): Promise<TypeResultSuscribirse> => {
  const url = import.meta.env.VITE_APP_URL_GESTIONAR;
  const body: { [key: string]: unknown } = {
    id_user,
    id_producto,
    valor,
  };
  if (notificacion.trim() !== "") body.notificacion = notificacion;

  const response = await fetchApp(url, "POST", {}, body);
  const status = response?.status ?? false;
  if (!status) {
    throw new Error(response?.msg ?? "Error al consumir el servicio");
  }
  return {
    id_movimiento: response?.obj?.id_movimiento,
  };
};

const ProductosDisponibles = ({
  productosDisponibles,
}: PropsProductosDisponibles) => {
  const user = useContextUser();
  const helperNavigate = useNavigate();
  const [paso, setPaso] = useState<TypePaso>("ninguno");
  const [showWindow, setShowWindow] = useState<boolean>(false);
  const [productoElegido, setProductoElegido] = useState<TypeProductos | null>(
    null
  );
  const [idMovimiento, setIdMovimiento] = useState<number | null>(null);
  const [valorInput, setValorInput] = useState<number>(0);
  const [notificacionInput, setNotificacionInput] = useState<string>("");
  const [loanding, setLoanding] = useState<boolean>(false);

  const inptRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inptRef.current)
      inptRef.current.setCustomValidity("Completa este campoooooooooo");
  }, []);

  const onSubmitAceptar = useCallback(
    (ev: MouseEvent<HTMLFormElement>) => {
      ev.preventDefault();
      if (!inptRef.current) return;

      inptRef.current.setCustomValidity("debe ser mayor o igual COP");
      inptRef.current.reportValidity();
      if (!productoElegido) return;

      if (valorInput < productoElegido.valor) {
        inptRef.current.setCustomValidity(
          `debe ser mayor o igual COP ${formatMoney.format(
            productoElegido.valor
          )}`
        );
        return;
      } else inptRef.current.setCustomValidity("");

      if (!productoElegido) return;
      toastContentPending(
        PeticionSuscribirse(
          user.id_user,
          productoElegido?.id_producto,
          valorInput,
          notificacionInput
        ),
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
    },
    [productoElegido, user.id_user, valorInput, notificacionInput]
  );

  return (
    <Fragment>
      {loanding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-b-black border-t-transparent"></div>
        </div>
      )}

      <div className={classes.containerProductFather}>
        <div className={classes.containerProduct}>
          {productosDisponibles.map(
            ({ id_producto, nombre, valor, categoria }: TypeProductos) => {
              return (
                <div className={classes.productInd} key={id_producto}>
                  <label className={classes.labelCategory}>
                    <strong>{categoria}</strong>
                  </label>
                  <label className={classes.productInd_label}>{nombre}</label>
                  <label className={classes.productInd_label}>
                    Monto minimo de vinculación
                  </label>
                  <label>{`COP ${formatMoney.format(valor)}`}</label>
                  <button
                    className={classes.productInd_button_new}
                    onClick={() => {
                      setNotificacionInput("");
                      setValorInput(0);
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
                    Suscribirse
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
            setNotificacionInput("");
            setValorInput(0);
            setShowWindow(false);
            if (paso == "aprobada") helperNavigate("../");
          }}
        >
          <form onSubmit={onSubmitAceptar}>
            {paso == "resumen" && (
              <div className="grid grid-flow-row auto-rows-max gap-4 place-items-center text-center">
                <h2 className="text-2xl font-semibold">
                  ¿Esta seguro que quiere suscripbirse?
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
                  <strong className="justify-self-end">Valor Minimo:</strong>
                  <p className="justify-self-start whitespace-pre-wrap break-all">
                    {`COP ${formatMoney.format(productoElegido.valor)}`}
                  </p>
                </h2>
                <div className="space-y-2">
                  <label
                    htmlFor="valor"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Ingrese valor
                  </label>
                  <input
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 placeholder-gray-400"
                    type="text"
                    placeholder="COP $ 0"
                    required
                    ref={inptRef}
                    value={`COP ${formatMoney.format(valorInput)}`}
                    onChange={(ev) => {
                      ev.target.setCustomValidity("");
                      setValorInput(
                        Number(ev.target.value.replace(/[^0-9]/g, ""))
                      );
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="opcion"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Seleccione a donde se enviara tu notificación
                  </label>
                  <select
                    id="opcion"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 placeholder-gray-400"
                    onChange={(ev) => {
                      setNotificacionInput(ev.target.value);
                    }}
                  >
                    <option value=""></option>
                    <option value="email">Correo</option>
                    <option value="celular">Celular</option>
                  </select>
                </div>

                <div className="flex gap-7 m-4">
                  <button className={classes.buttonAceptar} type={"submit"}>
                    Aceptar
                  </button>
                  <button
                    className={classes.buttonCancelar}
                    onClick={() => {
                      setNotificacionInput("");
                      setValorInput(0);
                      setShowWindow(false);
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </form>
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

export default ProductosDisponibles;
