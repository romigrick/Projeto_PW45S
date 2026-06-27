import { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import type { IProduct } from "@/commons/types";
import ProductService from "@/services/productService";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import { Divider } from "primereact/divider";

export const ProductListPage = () => {
  const [data, setData] = useState<IProduct[]>([]);
  const { findAll, remove } = ProductService;
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    const response = await findAll();
    if (response.status === 200) {
      setData(Array.isArray(response.data) ? response.data : []);
    } else {
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail: "Não foi possível carregar a lista de produtos.",
        life: 3000,
      });
    }
  };

  const handleEdit = (product: IProduct) => {
    navigate(`/admin/products/${product.id}`);
  };

  const handleDelete = (product: IProduct) => {
    confirmDialog({
      message: `Tem certeza que deseja excluir "${product.name}"?`,
      header: "Confirmar Exclusão",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Excluir",
      rejectLabel: "Cancelar",
      acceptClassName: "p-button-danger",
      accept: async () => {
        if (!product.id) return;
        try {
          await remove(product.id);
          setData((prev) => prev.filter((p) => p.id !== product.id));
          toast.current?.show({
            severity: "success",
            summary: "Sucesso",
            detail: "Produto removido com sucesso.",
            life: 3000,
          });
        } catch {
          toast.current?.show({
            severity: "error",
            summary: "Erro",
            detail: "Não foi possível remover o produto.",
            life: 3000,
          });
        }
      },
    });
  };

  const actionTemplate = (rowData: IProduct) => (
    <div className="flex gap-2">
      <Button
        icon="pi pi-pencil"
        className="p-button-sm p-button-text"
        style={{ color: '#003399' }}
        onClick={() => handleEdit(rowData)}
        tooltip="Editar"
        tooltipOptions={{ position: 'top' }}
      />
      <Button
        icon="pi pi-trash"
        className="p-button-sm p-button-text p-button-danger"
        onClick={() => handleDelete(rowData)}
        tooltip="Excluir"
        tooltipOptions={{ position: 'top' }}
      />
    </div>
  );

  const priceTemplate = (rowData: IProduct) =>
    Number(rowData.price).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  return (
    <>
      <Toast ref={toast} />
      <ConfirmDialog />

      {/* Cabeçalho */}
      <div className="flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="m-0 text-900 font-bold text-xl">Produtos</h2>
          <p className="m-0 text-500 text-sm mt-1">
            {data.length} produto{data.length !== 1 ? 's' : ''} cadastrado{data.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button
          label="Novo Produto"
          icon="pi pi-plus"
          style={{ backgroundColor: '#003399', borderColor: '#003399' }}
          onClick={() => navigate('/admin/products/new')}
        />
      </div>

      <div className="surface-card shadow-2 border-round p-3">
        <DataTable
          value={data}
          stripedRows
          emptyMessage="Nenhum produto cadastrado."
          className="p-datatable-sm"
        >
          <Column field="id" header="ID" style={{ width: '5%' }} />
          <Column field="name" header="Nome" />
          <Column field="description" header="Descrição" />
          <Column header="Preço" body={priceTemplate} style={{ width: '15%' }} />
          <Column field="category.name" header="Categoria" style={{ width: '15%' }} />
          <Column body={actionTemplate} header="Ações" style={{ width: '10%' }} />
        </DataTable>
      </div>
    </>
  );
};
