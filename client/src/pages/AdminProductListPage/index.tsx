import { useEffect, useMemo, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import type { IProduct } from "@/commons/types";
import ProductService from "@/services/productService";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import { useAuth } from "@/context/AuthContext";

export const ProductListPage = () => {
  const [data, setData] = useState<IProduct[]>([]);
  const [search, setSearch] = useState("");
  const { findAll, remove } = ProductService;
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const { isAdmin } = useAuth();

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

  const actionTemplate = (rowData: IProduct) => {
    if (!isAdmin) return null;
    return (
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
  };

  const filteredData = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return data;
    return data.filter((product) =>
      [product.name, product.description, product.category?.name]
        .filter(Boolean)
        .some((field) => field!.toLowerCase().includes(term))
    );
  }, [data, search]);

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
      <div className="flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
        <div>
          <h2 className="m-0 text-900 font-bold text-xl">Produtos</h2>
          <p className="m-0 text-500 text-sm mt-1">
            {filteredData.length} produto{filteredData.length !== 1 ? 's' : ''}
            {search ? ` encontrado${filteredData.length !== 1 ? 's' : ''}` : ' cadastrado' + (filteredData.length !== 1 ? 's' : '')}
          </p>
        </div>
        <div className="flex align-items-center gap-3 flex-wrap">
          <span className="p-input-icon-left">
            <i className="pi pi-search" style={{ left: '0.75rem' }} />

            <InputText
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar produto..."
              style={{ paddingLeft: '2.5rem' }}
            />
          </span>
          {isAdmin && (
            <Button
              label="Novo Produto"
              icon="pi pi-plus"
              style={{ backgroundColor: '#003399', borderColor: '#003399' }}
              onClick={() => navigate('/admin/products/new')}
            />
          )}
        </div>
      </div>

      <div className="surface-card border-round p-3">
        <DataTable
          value={filteredData}
          stripedRows
          emptyMessage="Nenhum produto encontrado."
          className="p-datatable-sm"
          removableSort
        >
          <Column field="id" header="ID" sortable style={{ width: '5%' }} />
          <Column field="name" header="Nome" sortable />
          <Column field="description" header="Descrição" sortable />
          <Column header="Preço" body={priceTemplate} field="price" sortable style={{ width: '15%' }} />
          <Column field="category.name" header="Categoria" sortable style={{ width: '15%' }} />
          {isAdmin && (
            <Column body={actionTemplate} header="Ações" style={{ width: '10%' }} />
          )}
        </DataTable>
      </div>
    </>
  );
};