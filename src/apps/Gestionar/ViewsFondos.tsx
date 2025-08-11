/* eslint @typescript-eslint/no-explicit-any: "off" */
import { useCallback, useEffect, useState } from "react";
import { useContextUser } from "../../context/useContextUser";
import fetchApp from "../../utils/fetchApp";
import { toastContentError } from "../../utils/toastContent";
import type { TypeProductos } from "./utils";
import ProductosActivos from "./components/ProductosActivos";
import ProductosDisponibles from "./components/ProductosDisponibles";

export type TypeProduct = "activos" | "disponibles";
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
          id_producto: Number(prod?.id),
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
      <ProductosActivos productosActivos={productosActivos}></ProductosActivos>
      <br></br>
      <ProductosDisponibles
        productosDisponibles={productosDisponibles}
      ></ProductosDisponibles>
    </div>
  );
};

export default ViewsFondos;
