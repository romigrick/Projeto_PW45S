import React, { useEffect, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { ProgressSpinner } from 'primereact/progressspinner';
import { InputText } from 'primereact/inputtext';
import UserService from '../../services/userService';
import type { IUser } from '../../commons/types';

const ROLE_OPTIONS = [
  { label: 'Administrador', value: 'ROLE_ADMIN' },
  { label: 'Operador', value: 'ROLE_OPERATOR' },
  { label: 'Cliente', value: 'ROLE_CLIENTE' },
];

const roleLabel = (role: string) => {
  if (role === 'ROLE_ADMIN') return 'Admin';
  if (role === 'ROLE_OPERATOR') return 'Operador';
  if (role === 'ROLE_CLIENTE') return 'Cliente';
  return role;
};

export const AdminUsersPage = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState('');
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [selectedRole, setSelectedRole] = useState('ROLE_USER');
  const [saving, setSaving] = useState(false);
  const toast = useRef<Toast>(null);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const response = await UserService.getAllUsers();
    if (response.success) {
      setUsers(response.data || []);
    } else {
      toast.current?.show({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar usuários', life: 3000 });
    }
    setLoading(false);
  };

  const openDialog = (user: IUser) => {
    setSelectedUser(user);
    // roles é Set<string> serializado como array pelo Jackson
    const currentRole = Array.from(user.roles || [])[0] || 'ROLE_USER';
    setSelectedRole(currentRole);
    setDialogVisible(true);
  };

  const handleSave = async () => {
    if (!selectedUser?.id) return;
    setSaving(true);
    const response = await UserService.activateUser(selectedUser.id, selectedRole);
    if (response.success) {
      toast.current?.show({
        severity: 'success',
        summary: 'Sucesso',
        detail: selectedUser.active ? 'Perfil atualizado!' : 'Usuário ativado com sucesso!',
        life: 3000,
      });
      setDialogVisible(false);
      fetchUsers();
    } else {
      toast.current?.show({ severity: 'error', summary: 'Erro', detail: response.message || 'Falha ao salvar', life: 3000 });
    }
    setSaving(false);
  };

  // ── Templates ──────────────────────────────────────────────────────────────

  const statusTemplate = (row: IUser) => (
    <Tag severity={row.active ? 'success' : 'warning'} value={row.active ? 'Ativo' : 'Inativo'} />
  );

  const roleTemplate = (row: IUser) => {
    const roles = Array.from(row.roles || []);
    if (roles.length === 0) return <span className="text-400">—</span>;
    return (
      <div className="flex gap-1 flex-wrap">
        {roles.map((r) => (
          <Tag
            key={r}
            value={roleLabel(r)}
            severity={r === 'ROLE_ADMIN' ? 'danger' : r === 'ROLE_OPERATOR' ? 'warning' : 'info'}
          />
        ))}
      </div>
    );
  };

  const actionsTemplate = (row: IUser) => (
    <Button
      icon={row.active ? 'pi pi-pencil' : 'pi pi-user-plus'}
      label={row.active ? 'Editar perfil' : 'Ativar'}
      className="p-button-sm p-button-outlined"
      severity={row.active ? undefined : 'success'}
      onClick={() => openDialog(row)}
    />
  );

  // ── Filtro ─────────────────────────────────────────────────────────────────

  const q = globalFilter.toLowerCase();
  const filteredUsers = users.filter((u) =>
    !q ||
    u.displayName?.toLowerCase().includes(q) ||
    u.username?.toLowerCase().includes(q) ||
    u.email?.toLowerCase().includes(q)
  );

  const header = (
    <div className="flex flex-wrap align-items-center justify-content-between gap-3">
      <span className="text-xl font-bold text-900">Gerenciamento de Usuários</span>
      <div className="flex gap-2 align-items-center">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            placeholder="Buscar por nome, e-mail..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </span>
        <Button icon="pi pi-refresh" className="p-button-outlined" tooltip="Atualizar" onClick={fetchUsers} />
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <ProgressSpinner />
      </div>
    );
  }

  const totalActive = users.filter((u) => u.active).length;
  const totalPending = users.filter((u) => !u.active).length;

  return (
    <div>
      <Toast ref={toast} />

      {/* Summary cards */}
      <div
        className="mb-4"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}
      >
        <div className="surface-card shadow-2 border-round p-3 text-center" style={{ borderTop: '3px solid #3b82f6' }}>
          <span className="block text-500 text-sm mb-1">Total de Usuários</span>
          <span className="block font-bold text-3xl text-900">{users.length}</span>
        </div>
        <div className="surface-card shadow-2 border-round p-3 text-center" style={{ borderTop: '3px solid #22c55e' }}>
          <span className="block text-500 text-sm mb-1">Ativos</span>
          <span className="block font-bold text-3xl text-green-600">{totalActive}</span>
        </div>
        <div className="surface-card shadow-2 border-round p-3 text-center" style={{ borderTop: '3px solid #f59e0b' }}>
          <span className="block text-500 text-sm mb-1">Aguardando Ativação</span>
          <span className="block font-bold text-3xl text-orange-500">{totalPending}</span>
        </div>
      </div>

      {/* Table */}
      <div className="surface-card shadow-2 border-round p-3">
        <DataTable
          value={filteredUsers}
          header={header}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          emptyMessage="Nenhum usuário encontrado."
          stripedRows
          responsiveLayout="scroll"
          className="p-datatable-sm"
        >
          <Column field="id" header="ID" sortable style={{ width: '5rem' }} />
          <Column field="displayName" header="Nome" sortable />
          <Column field="username" header="Usuário" sortable />
          <Column field="email" header="E-mail" sortable />
          <Column header="Perfil" body={roleTemplate} />
          <Column header="Status" body={statusTemplate} sortable sortField="active" />
          <Column header="Ações" body={actionsTemplate} style={{ width: '12rem' }} />
        </DataTable>
      </div>

      {/* Dialog */}
      <Dialog
        visible={dialogVisible}
        onHide={() => setDialogVisible(false)}
        header={selectedUser?.active ? 'Editar Perfil do Usuário' : 'Ativar Usuário'}
        style={{ width: '420px' }}
        modal
        footer={
          <div className="flex justify-content-end gap-2">
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={() => setDialogVisible(false)} />
            <Button
              label={selectedUser?.active ? 'Salvar' : 'Ativar'}
              icon="pi pi-check"
              loading={saving}
              onClick={handleSave}
            />
          </div>
        }
      >
        <div className="p-3">
          <div className="mb-3 p-3 surface-50 border-round border-1 border-200">
            <p className="m-0 text-700 text-sm"><strong>Nome:</strong> {selectedUser?.displayName}</p>
            <p className="m-0 mt-1 text-700 text-sm"><strong>Usuário:</strong> {selectedUser?.username}</p>
            {selectedUser?.email && (
              <p className="m-0 mt-1 text-700 text-sm"><strong>E-mail:</strong> {selectedUser.email}</p>
            )}
          </div>
          <label className="block text-700 font-medium mb-2">Perfil de acesso</label>
          <Dropdown
            value={selectedRole}
            options={ROLE_OPTIONS}
            onChange={(e) => setSelectedRole(e.value)}
            className="w-full"
          />
          {!selectedUser?.active && (
            <p className="text-500 text-sm mt-3 mb-0">
              <i className="pi pi-info-circle mr-1" />
              Ao confirmar, o usuário será ativado com o perfil selecionado.
            </p>
          )}
        </div>
      </Dialog>
    </div>
  );
};
