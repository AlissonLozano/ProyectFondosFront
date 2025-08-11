/* eslint @typescript-eslint/no-explicit-any: "off" */
import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import classes from "./ViewsInicio.module.css";
import { ListRoutesModule } from "../../routes/subRoutes";
import { formatMoney } from "../../components/InputsCustom/InputCustomMoney";
import { useContextUser } from "../../context/useContextUser";
import fetchApp from "../../utils/fetchApp";
import { toastContentError } from "../../utils/toastContent";

export type TypeResultCuenta = {
  cupo: number;
  cuenta: string;
};

const PeticionCuenta = async (id_user: number): Promise<TypeResultCuenta> => {
  const url = import.meta.env.VITE_APP_URL_CUENTA;
  const params = {
    id_user,
  };

  const response = await fetchApp(url, "GET", params, {});
  const status = response?.status ?? false;
  if (!status) {
    throw new Error(response?.msg ?? "Error al consumir el servicio");
  }
  return {
    cupo: response?.obj?.cupo,
    cuenta: response?.obj?.cuenta,
  };
};

const ViewsInicio = () => {
  const user = useContextUser();
  const [dataCuenta, setDataCuenta] = useState<TypeResultCuenta | null>(null);

  useEffect(() => {
    PeticionCuenta(user.id_user)
      .then((result: TypeResultCuenta) => {
        setDataCuenta(result);
      })
      .catch((error: any) => {
        toastContentError(error?.message, 5000, {
          toastId: "error_backend_cuenta",
        });
      });
  }, [user.id_user]);

  return (
    <Fragment>
      {dataCuenta && (
        <div className="m-10 flex flex-col items-center">
          <div className="w-80 h-48 rounded-xl bg-gradient-to-br bg-blue-500 text-white p-6 flex flex-col justify-between shadow-xl">
            <label className="flex justify-between items-start text-2xl">
              FONDOS
            </label>
            <label className="tracking-widest text-sm">
              {dataCuenta.cuenta}
            </label>
            <label className="text-2xl font-bold">{`COP ${formatMoney.format(
              dataCuenta.cupo
            )}`}</label>
            <div className="flex justify-end">
              <div className="relative w-10 h-6">
                <span className="absolute left-0 top-0 w-6 h-6 bg-black rounded-full opacity-90"></span>
                <span className="absolute left-4 top-0 w-6 h-6 bg-yellow-400 rounded-full opacity-90"></span>
              </div>
            </div>
          </div>
        </div>
      )}

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
    </Fragment>
  );
};

export default ViewsInicio;
