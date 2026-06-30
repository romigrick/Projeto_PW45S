import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Divider } from 'primereact/divider';
import type { ICategory } from '@/commons/types';
import CategoryService from '@/services/categoryService';
import { useAuth } from '@/context/AuthContext';

export const AdminCategoryFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const isEdit = !!id;
  const { isAdmin, loading: authLoading } = useAuth();

  const [loadingPage, setLoadingPage] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ICategory>({
    defaultValues: { name: '' },
  });

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/admin/categories', { replace: true });
    }
  }, [authLoading, isAdmin, navigate]);

  useEffect(() => {
    if (!isEdit) return;
    setLoadingPage(true);
    CategoryService.findById(parseInt(id!)).then((res) => {
      if (res.success) {
        const category = res.data as ICategory;
        reset(category);
      } else {
        toast.current?.show({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar categoria.', life: 3000 });
      }
      setLoadingPage(false);
    });
  }, [id]);

  const onSubmit = async (data: ICategory) => {
    setSaving(true);
    const res = await CategoryService.save(data);
    if (res.success || res.status === 200 || res.status === 201) {
      toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: isEdit ? 'Categoria atualizada!' : 'Categoria criada!', life: 3000 });
      setTimeout(() => navigate('/admin/categories'), 1200);
    } else {
      toast.current?.show({ severity: 'error', summary: 'Erro', detail: res.message || 'Falha ao salvar categoria.', life: 3000 });
    }
    setSaving(false);
  };

  if (authLoading || !isAdmin) {
    return (
      <div className="flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <ProgressSpinner />
      </div>
    );
  }

  if (loadingPage) {
    return (
      <div className="flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <ProgressSpinner />
      </div>
    );
  }

  return (
    <>
      <Toast ref={toast} />

      <style>{`
        .category-form-grid {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 1.5rem;
          align-items: start;
        }
        @media (max-width: 960px) {
          .category-form-grid {
            grid-template-columns: 1fr;
          }
        }
        .category-form-card {
          background: var(--surface-card);
          border-radius: 6px;
          padding: 1.25rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06);
        }
        .category-form-card + .category-form-card {
          margin-top: 1.5rem;
        }
      `}</style>

      {/* Cabeçalho */}
      <div className="flex align-items-center gap-3 mb-4">
        <Button
          icon="pi pi-arrow-left"
          className="p-button-text p-button-sm"
          style={{ color: '#003399' }}
          onClick={() => navigate('/admin/categories')}
          tooltip="Voltar"
          type="button"
        />
        <div>
          <h2 className="m-0 text-900 font-bold text-xl">{isEdit ? 'Editar Categoria' : 'Nova Categoria'}</h2>
          <p className="m-0 text-500 text-sm mt-1">
            {isEdit ? 'Atualize os dados da categoria' : 'Preencha os dados para cadastrar uma categoria'}
          </p>
        </div>
      </div>

      <div className="category-form-grid">
        {/* Coluna principal */}
        <div>
          <div className="category-form-card">
            <h4 className="mt-0 mb-3 text-700 font-semibold text-sm uppercase" style={{ letterSpacing: '0.05em' }}>
              Informações Gerais
            </h4>
            <Divider className="mt-0 mb-4" />

            <div className="field mb-0">
              <label className="block text-700 font-medium text-sm mb-2">
                Nome <span className="text-red-500">*</span>
              </label>
              <Controller
                name="name"
                control={control}
                rules={{ required: 'Nome é obrigatório' }}
                render={({ field }) => (
                  <InputText {...field} placeholder="Ex: Periféricos" className={`w-full ${errors.name ? 'p-invalid' : ''}`} />
                )}
              />
              {errors.name && <small className="p-error mt-1 block">{errors.name.message}</small>}
            </div>
          </div>
        </div>

        {/* Coluna lateral */}
        <div>
          <div className="category-form-card">
            <Button
              label={isEdit ? 'Atualizar Categoria' : 'Salvar Categoria'}
              icon="pi pi-check"
              className="w-full mb-2"
              style={{ backgroundColor: '#003399', borderColor: '#003399' }}
              loading={saving}
              disabled={saving}
              onClick={handleSubmit(onSubmit)}
              type="button"
            />
            <Button
              label="Cancelar"
              icon="pi pi-times"
              className="w-full p-button-outlined p-button-secondary"
              disabled={saving}
              onClick={() => navigate('/admin/categories')}
              type="button"
            />
          </div>
        </div>
      </div>
    </>
  );
};