import { useEffect, useMemo, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import type { ICategory } from "@/commons/types";
import CategoryService from "@/services/categoryService";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import { useAuth } from "@/context/AuthContext";

export const AdminCategoryListPage = () => {
  const [data, setData] = useState<ICategory[]>([]);
  const [search, setSearch] = useState("");
  const { findAll, remove } = CategoryService;
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
        detail: "Não foi possível carregar a lista de categorias.",
        life: 3000,
      });
    }
  };

  const handleEdit = (category: ICategory) => {
    navigate(`/admin/categories/${category.id}`);
  };

  const handleDelete = (category: ICategory) => {
    confirmDialog({
      message: `Tem certeza que deseja excluir "${category.name}"?`,
      header: "Confirmar Exclusão",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Excluir",
      rejectLabel: "Cancelar",
      acceptClassName: "p-button-danger",
      accept: async () => {
        if (!category.id) return;
        try {
          await remove(category.id);
          setData((prev) => prev.filter((c) => c.id !== category.id));
          toast.current?.show({
            severity: "success",
            summary: "Sucesso",
            detail: "Categoria removida com sucesso.",
            life: 3000,
          });
        } catch {
          toast.current?.show({
            severity: "error",
            summary: "Erro",
            detail: "Não foi possível remover a categoria.",
            life: 3000,
          });
        }
      },
    });
  };

  const filteredData = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return data;
    return data.filter((category) => category.name?.toLowerCase().includes(term));
  }, [data, search]);

  const actionTemplate = (rowData: ICategory) => {
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

  return (
    <>
      <Toast ref={toast} />
      <ConfirmDialog />

      {/* Cabeçalho */}
      <div className="flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
        <div>
          <h2 className="m-0 text-900 font-bold text-xl">Categorias</h2>
          <p className="m-0 text-500 text-sm mt-1">
            {filteredData.length} categoria{filteredData.length !== 1 ? 's' : ''}
            {search ? ` encontrada${filteredData.length !== 1 ? 's' : ''}` : ' cadastrada' + (filteredData.length !== 1 ? 's' : '')}
          </p>
        </div>
        <div className="flex align-items-center gap-3 flex-wrap">
          <span className="p-input-icon-left">
            <i className="pi pi-search" style={{ left: '0.75rem' }} />

            <InputText
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar categoria..."
              style={{ paddingLeft: '2.5rem' }}
            />
          </span>
          {isAdmin && (
            <Button
              label="Nova Categoria"
              icon="pi pi-plus"
              style={{ backgroundColor: '#003399', borderColor: '#003399' }}
              onClick={() => navigate('/admin/categories/new')}
            />
          )}
        </div>
      </div>

      <div className="surface-card border-round p-3">
        <DataTable
          value={filteredData}
          stripedRows
          emptyMessage="Nenhuma categoria encontrada."
          className="p-datatable-sm"
          removableSort
        >
          <Column field="id" header="ID" sortable style={{ width: '10%' }} />
          <Column field="name" header="Nome" sortable />
          {isAdmin && (
            <Column body={actionTemplate} header="Ações" style={{ width: '10%' }} />
          )}
        </DataTable>
      </div>
    </>
  );
};