import { useNavigate, useParams } from 'react-router-dom';
import { CustomerForm } from '../../components/forms/CustomerForm';
import { useCustomer } from '../../hooks/useCustomers';
import { useCustomerMutations } from '../../hooks/useCustomerMutations';
import { LoadingState } from '../../components/common/StateViews';
import type { Customer } from '../../types/entities';

export function CustomerFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const { item, loading } = useCustomer(id);
  const { create, update } = useCustomerMutations();

  if (isEdit && loading) return <LoadingState />;

  async function handleSubmit(name: string, email: string) {
    if (isEdit && id) {
      await update(id, name, email);
      navigate(`/customers/${id}`);
    } else {
      const created = (await create(name, email)) as Customer;
      navigate(`/customers/${created.id}`);
    }
  }

  return (
    <section>
      <h2>{isEdit ? 'Edit Customer' : 'New Customer'}</h2>
      <CustomerForm
        initial={item ? { name: item.name, email: item.email } : undefined}
        onSubmit={handleSubmit}
        submitLabel={isEdit ? 'Save' : 'Create'}
      />
    </section>
  );
}
