import { useQuery, useMutation } from 'react-query';
import axios from 'axios';

const BASE_URL = 'http://localhost:4000';

const fetchCampaigns = async ({ page = 1, limit = 10, start, end }) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/campaigns`, {
      params: { page, limit, start, end },
    });
    return response.data.items;
  } catch (error) {
    throw new Error('Failed to fetch campaigns');
  }
};

const addCampaign = async (campaignData) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/campaigns`, campaignData);
    return response.data;
  } catch (error) {
    throw new Error('Failed to add campaign');
  }
};

const updateCampaign = async (campaignId, campaignData) => {
  try {
    const response = await axios.put(`${BASE_URL}/api/campaigns/${campaignId}`, campaignData);
    return response.data;
  } catch (error) {
    throw new Error('Failed to update campaign');
  }
};

const deleteCampaign = async (campaignId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/api/campaigns/${campaignId}`);
    return true;
  } catch (error) {
    throw new Error('Failed to delete campaign');
  }
};

const useCampaigns = (options = {}) => {
  const campaignsQuery = useQuery(['campaigns', options], () => fetchCampaigns(options));

  const addCampaignMutation = useMutation(addCampaign, {
    onSuccess: () => campaignsQuery.refetch(),
  });
  const updateCampaignMutation = useMutation(updateCampaign, {
    onSuccess: () => campaignsQuery.refetch(),
  });
  const deleteCampaignMutation = useMutation(deleteCampaign, {
    onSuccess: () => campaignsQuery.refetch(),
  });

  return {
    ...campaignsQuery,
    addCampaign: addCampaignMutation.mutate,
    updateCampaign: updateCampaignMutation.mutate,
    deleteCampaign: deleteCampaignMutation.mutate,
  };
};

export default useCampaigns;
