import { Link } from 'react-router-dom';
import { useCustomersList } from '../../hooks/useCustomers';
import { LoadingState, ErrorState, EmptyState } from '../../components/common/StateViews';

export function CustomerListPage() {
  const { items, total, loading, error } = useCustomersList();

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  return (
    <section>
      <div className="page-header">
        <h2>Customers ({total})</h2>
        <Link to="/customers/new" className="btn">
          + New Customer
        </Link>
      </div>
      {items.length === 0 ? (
        <EmptyState />
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {items.map((customer) => (
              <tr key={customer.id}>
                <td>
                  <Link to={`/customers/${customer.id}`}>{customer.name}</Link>
                </td>
                <td>{customer.email}</td>
                <td>{new Date(customer.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
