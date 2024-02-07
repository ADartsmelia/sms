import { useQuery, useMutation } from 'react-query';
import axios from 'axios';

const BASE_URL = 'http://localhost:4000';

const fetchCustomers = async ({ page = 1, limit = 10, start, end }) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/customers`, {
      params: { page, limit, start, end },
    });
    return response.data.items;
  } catch (error) {
    throw new Error('Failed to fetch customers');
  }
};

const addCustomer = async (customerData) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/customers`, customerData);
    return response.data;
  } catch (error) {
    throw new Error('Failed to add customer');
  }
};

const updateCustomer = async ({ customerId, email, phone }) => {
  try {
    const response = await axios.put(`${BASE_URL}/api/customers/${customerId}`, { email, phone });
    return response.data;
  } catch (error) {
    throw new Error('Failed to update customer');
  }
};

const fetchCustomerById = async (customerId) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/customers/${customerId}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch customer');
  }
};

const deleteCustomer = async (customerId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/api/customers/${customerId}`);
    return true;
  } catch (error) {
    throw new Error('Failed to delete customer');
  }
};

// Exporting fetchCustomerById function
export { fetchCustomerById };

const useCustomers = (options = {}) => {
  const customersQuery = useQuery(['customers', options], () => fetchCustomers(options));

  const addCustomerMutation = useMutation(addCustomer, {
    onSuccess: () => {
      customersQuery.refetch();
    },
  });
  const updateCustomerMutation = useMutation(updateCustomer, {
    onSuccess: () => {
      customersQuery.refetch();
    },
  });
  const customerQuery = useQuery(
    ['customer', options.customerId],
    () => fetchCustomerById(options.customerId),
    {
      enabled: !!options.customerId,
    }
  );
  const deleteCustomerMutation = useMutation(deleteCustomer, {
    onSuccess: () => {
      customersQuery.refetch();
    },
  });

  return {
    ...customersQuery,
    addCustomer: addCustomerMutation.mutate,
    updateCustomer: updateCustomerMutation.mutate,
    customer: customerQuery,
    deleteCustomer: deleteCustomerMutation.mutate,
  };
};

export default useCustomers;
