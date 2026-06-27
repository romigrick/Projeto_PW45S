import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Divider } from 'primereact/divider';
import type { ICategory, IProduct } from '@/commons/types';
import CategoryService from '@/services/categoryService';
import ProductService from '@/services/productService';

export const AdminProductFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const isEdit = !!id;

  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loadingPage, setLoadingPage] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IProduct>({
    defaultValues: { name: '', description: '', price: 0, urlImagem: '', category: undefined },
  });

  useEffect(() => {
    CategoryService.findAll().then((res) => {
      if (res.success && Array.isArray(res.data)) setCategories(res.data as ICategory[]);
    });
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    setLoadingPage(true);
    ProductService.findById(parseInt(id!)).then((res) => {
      if (res.success) {
        const product = res.data as IProduct;
        reset(product);
        if (product.urlImagem) setImagePreview(product.urlImagem);
      } else {
        toast.current?.show({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar produto.', life: 3000 });
      }
      setLoadingPage(false);
    });
  }, [id]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const onSubmit = async (data: IProduct) => {
    if (!imageFile && !isEdit) {
      toast.current?.show({ severity: 'warn', summary: 'Atenção', detail: 'Selecione uma imagem para o produto.', life: 3000 });
      return;
    }
    setSaving(true);
    const res = await ProductService.save(data, imageFile);
    if (res.success || res.status === 200 || res.status === 201) {
      toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: isEdit ? 'Produto atualizado!' : 'Produto criado!', life: 3000 });
      setTimeout(() => navigate('/admin/products'), 1200);
    } else {
      toast.current?.show({ severity: 'error', summary: 'Erro', detail: res.message || 'Falha ao salvar produto.', life: 3000 });
    }
    setSaving(false);
  };

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
        .product-form-grid {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 1.5rem;
          align-items: start;
        }
        @media (max-width: 960px) {
          .product-form-grid {
            grid-template-columns: 1fr;
          }
        }
        .product-form-card {
          background: var(--surface-card);
          border-radius: 6px;
          padding: 1.25rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06);
        }
        .product-form-card + .product-form-card {
          margin-top: 1.5rem;
        }
        .image-drop-area {
          border: 2px dashed #cbd5e1;
          border-radius: 8px;
          padding: 2.5rem 1rem;
          text-align: center;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
        }
        .image-drop-area:hover {
          border-color: #003399;
          background: #f0f4ff;
        }
      `}</style>

      {/* Cabeçalho */}
      <div className="flex align-items-center gap-3 mb-4">
        <Button
          icon="pi pi-arrow-left"
          className="p-button-text p-button-sm"
          style={{ color: '#003399' }}
          onClick={() => navigate('/admin/products')}
          tooltip="Voltar"
          type="button"
        />
        <div>
          <h2 className="m-0 text-900 font-bold text-xl">{isEdit ? 'Editar Produto' : 'Novo Produto'}</h2>
          <p className="m-0 text-500 text-sm mt-1">
            {isEdit ? 'Atualize os dados do produto' : 'Preencha os dados para cadastrar um produto'}
          </p>
        </div>
      </div>

      <div className="product-form-grid">
        {/* Coluna principal */}
        <div>
          {/* Informações gerais */}
          <div className="product-form-card">
            <h4 className="mt-0 mb-3 text-700 font-semibold text-sm uppercase" style={{ letterSpacing: '0.05em' }}>
              Informações Gerais
            </h4>
            <Divider className="mt-0 mb-4" />

            <div className="field mb-4">
              <label className="block text-700 font-medium text-sm mb-2">
                Nome <span className="text-red-500">*</span>
              </label>
              <Controller
                name="name"
                control={control}
                rules={{ required: 'Nome é obrigatório' }}
                render={({ field }) => (
                  <InputText {...field} placeholder="Ex: Mouse Gamer RGB" className={`w-full ${errors.name ? 'p-invalid' : ''}`} />
                )}
              />
              {errors.name && <small className="p-error mt-1 block">{errors.name.message}</small>}
            </div>

            <div className="field mb-0">
              <label className="block text-700 font-medium text-sm mb-2">
                Descrição <span className="text-red-500">*</span>
              </label>
              <Controller
                name="description"
                control={control}
                rules={{ required: 'Descrição é obrigatória' }}
                render={({ field }) => (
                  <InputTextarea
                    {...field}
                    rows={4}
                    placeholder="Descreva o produto..."
                    className={`w-full ${errors.description ? 'p-invalid' : ''}`}
                    autoResize
                  />
                )}
              />
              {errors.description && <small className="p-error mt-1 block">{errors.description.message}</small>}
            </div>
          </div>

          {/* Imagem */}
          <div className="product-form-card">
            <h4 className="mt-0 mb-3 text-700 font-semibold text-sm uppercase" style={{ letterSpacing: '0.05em' }}>
              Imagem do Produto
            </h4>
            <Divider className="mt-0 mb-4" />

            {imagePreview ? (
              <div className="flex flex-column align-items-center gap-3">
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{
                    width: '100%',
                    maxWidth: '320px',
                    maxHeight: '220px',
                    objectFit: 'contain',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    padding: '0.5rem',
                    background: '#f8fafc',
                  }}
                />
                <div className="flex gap-2 flex-wrap justify-content-center">
                  <Button
                    icon="pi pi-refresh"
                    label="Trocar imagem"
                    className="p-button-outlined p-button-sm"
                    style={{ borderColor: '#003399', color: '#003399' }}
                    onClick={() => fileInputRef.current?.click()}
                    type="button"
                  />
                  <Button
                    icon="pi pi-trash"
                    label="Remover"
                    className="p-button-outlined p-button-danger p-button-sm"
                    onClick={handleRemoveImage}
                    type="button"
                  />
                </div>
              </div>
            ) : (
              <div className="image-drop-area" onClick={() => fileInputRef.current?.click()}>
                <i className="pi pi-image" style={{ fontSize: '2rem', color: '#94a3b8', display: 'block', marginBottom: '0.75rem' }} />
                <p className="m-0 text-700 font-medium text-sm">Clique para selecionar uma imagem</p>
                <p className="m-0 text-500 text-xs mt-1">PNG, JPG ou JPEG — máx. 10 MB</p>
              </div>
            )}
            <input ref={fileInputRef} type="file" accept=".png,.jpg,.jpeg" style={{ display: 'none' }} onChange={handleImageSelect} />
          </div>
        </div>

        {/* Coluna lateral */}
        <div>
          {/* Preço e Categoria */}
          <div className="product-form-card">
            <h4 className="mt-0 mb-3 text-700 font-semibold text-sm uppercase" style={{ letterSpacing: '0.05em' }}>
              Preço e Categoria
            </h4>
            <Divider className="mt-0 mb-4" />

            <div className="field mb-4">
              <label className="block text-700 font-medium text-sm mb-2">
                Preço <span className="text-red-500">*</span>
              </label>
              <Controller
                name="price"
                control={control}
                rules={{ required: 'Preço é obrigatório', min: { value: 0.01, message: 'Deve ser maior que zero' } }}
                render={({ field }) => (
                  <InputNumber
                    value={field.value}
                    onValueChange={(e) => field.onChange(e.value)}
                    mode="currency"
                    currency="BRL"
                    locale="pt-BR"
                    className={`w-full ${errors.price ? 'p-invalid' : ''}`}
                    inputClassName="w-full"
                    placeholder="R$ 0,00"
                  />
                )}
              />
              {errors.price && <small className="p-error mt-1 block">{errors.price.message}</small>}
            </div>

            <div className="field mb-0">
              <label className="block text-700 font-medium text-sm mb-2">
                Categoria <span className="text-red-500">*</span>
              </label>
              <Controller
                name="category"
                control={control}
                rules={{ required: 'Categoria é obrigatória' }}
                render={({ field }) => (
                  <Dropdown
                    {...field}
                    options={categories}
                    optionLabel="name"
                    placeholder="Selecionar categoria"
                    className={`w-full ${errors.category ? 'p-invalid' : ''}`}
                    emptyMessage="Nenhuma categoria encontrada"
                  />
                )}
              />
              {errors.category && <small className="p-error mt-1 block">{errors.category.message}</small>}
            </div>
          </div>

          {/* Ações */}
          <div className="product-form-card">
            <Button
              label={isEdit ? 'Atualizar Produto' : 'Salvar Produto'}
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
              onClick={() => navigate('/admin/products')}
              type="button"
            />
          </div>
        </div>
      </div>
    </>
  );
};
