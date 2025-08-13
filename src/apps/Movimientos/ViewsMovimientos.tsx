/* eslint @typescript-eslint/no-explicit-any: "off" */
import { useEffect, useState } from "react";
import fetchApp from "../../utils/fetchApp";
import { useContextUser } from "../../context/useContextUser";
import { toastContentError } from "../../utils/toastContent";
import { formatMoney } from "../../components/InputsCustom/InputCustomMoney";

export type TypeMovimientoInd = {
  id_movimiento: number;
  descripcion: string;
  producto: {
    id: number;
    nombre: string;
    categoria: string;
  };
  fecha: string;
  valor: number;
};

export type TypeResultMovimientos = {
  movimientos: TypeMovimientoInd[];
};

const PeticionMovimientos = async (
  id_user: number
): Promise<TypeResultMovimientos> => {
  const url = import.meta.env.VITE_APP_URL_MOVIMIENTOS;
  const params = {
    id_user,
  };
  const response = await fetchApp(url, "GET", params, {});
  const status = response?.status ?? false;
  if (!status) {
    throw new Error(response?.msg ?? "Error al consumir el servicio");
  }
  return {
    movimientos: response?.obj?.movimientos ?? [],
  };
};

const ViewsMovimientos = () => {
  const user = useContextUser();
  const [dataMovimientos, setDataMovimientos] = useState<TypeMovimientoInd[]>(
    []
  );

  useEffect(() => {
    PeticionMovimientos(user.id_user)
      .then((result: TypeResultMovimientos) => {
        setDataMovimientos(result.movimientos);
      })
      .catch((error: any) => {
        toastContentError(error?.message, 5000, {
          toastId: "error_backend_mov",
        });
      });
  }, [user.id_user]);

  return (
    <div className="p-6">
      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className="min-w-full text-sm text-center text-gray-300">
          <thead className="bg-gray-900 text-gray-100 uppercase text-xs">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Descripción</th>
              <th className="px-6 py-3">Valor</th>
              <th className="px-6 py-3">Fecha</th>
              <th className="px-6 py-3">Nombre</th>
              <th className="px-6 py-3">Categoria</th>
            </tr>
          </thead>
          <tbody>
            {dataMovimientos.map((row) => (
              <tr
                key={row.id_movimiento}
                className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700 transition"
              >
                <td className="px-6 py-4">{row.id_movimiento}</td>
                <td className="px-6 py-4">{row.descripcion}</td>
                <td className="px-6 py-4">{formatMoney.format(row.valor)}</td>
                <td className="px-6 py-4">{row.fecha}</td>
                <td className="px-6 py-4">{row.producto.nombre}</td>
                <td className="px-6 py-4">{row.producto.categoria}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewsMovimientos;
