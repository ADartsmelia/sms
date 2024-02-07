import { useQuery, useMutation } from 'react-query';
import axios from 'axios';

const BASE_URL = 'http://localhost:4000';

const fetchTemplates = async ({ page = 1, limit = 10, start, end }) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/templates`, {
      params: { page, limit, start, end },
    });
    return response.data.items;
  } catch (error) {
    throw new Error('Failed to fetch templates');
  }
};

const addTemplate = async (templateData) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/templates`, templateData);
    return response.data;
  } catch (error) {
    throw new Error('Failed to add template');
  }
};

const updateTemplate = async (templateId, templateData) => {
  try {
    const response = await axios.put(`${BASE_URL}/api/templates/${templateId}`, templateData);
    return response.data;
  } catch (error) {
    throw new Error('Failed to update template');
  }
};

const fetchTemplateById = async (templateId) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/templates/${templateId}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch template');
  }
};

const deleteTemplate = async (templateId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/api/templates/${templateId}`);
    return true;
  } catch (error) {
    throw new Error('Failed to delete template');
  }
};

const useTemplates = (options = {}) => {
  const templatesQuery = useQuery(['templates', options], () => fetchTemplates(options));

  const addTemplateMutation = useMutation(addTemplate, {
    onSuccess: () => {
      templatesQuery.refetch();
    },
  });
  const updateTemplateMutation = useMutation(updateTemplate, {
    onSuccess: () => {
      templatesQuery.refetch();
    },
  });
  const templateQuery = useQuery(
    ['template', options.templateId],
    () => fetchTemplateById(options.templateId),
    {
      enabled: !!options.templateId,
    }
  );
  const deleteTemplateMutation = useMutation(deleteTemplate, {
    onSuccess: () => {
      templatesQuery.refetch();
    },
  });

  return {
    ...templatesQuery,
    addTemplate: addTemplateMutation.mutate,
    updateTemplate: updateTemplateMutation.mutate,
    template: templateQuery,
    deleteTemplate: deleteTemplateMutation.mutate,
  };
};

export default useTemplates;
