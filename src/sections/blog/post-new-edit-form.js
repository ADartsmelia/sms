import PropTypes from 'prop-types';
import { useState } from 'react';

import axios from 'axios';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
// import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// routes
import { useRouter } from 'src/routes/hooks';
// components
import { useSnackbar } from 'src/components/snackbar';

import { Autocomplete, FormLabel, TextField } from '@mui/material';
import useTemplates from 'src/customHooks/templates';

// ----------------------------------------------------------------------

export default function PostNewEditForm({ currentPost }) {
  const [gpt, setGpt] = useState(false);
  const { addTemplate } = useTemplates();

  const [defaultValues, setDefaultValues] = useState({
    message_body: '',
    status: 'DRAFT',
    tags: ['development'],
    variable: [],
  });

  const router = useRouter();

  const mdUp = useResponsive('up', 'md');
  const _tags = ['All', 'Development', 'Marketing', 'Tech', 'SuperMarket'];
  const _variables = ['company name', 'user name', 'phone', 'email'];

  const { enqueueSnackbar } = useSnackbar();

  const sendMessage = async () => {
    try {
      setGpt(true);

      const userTags = defaultValues.tags;
      const prompt = `
      Generate an Short SMS marketing template for a promotional message. Include the following information:
      - Product/Service: [Specify product or service]
      - Promotion Type: [Select from ${userTags
        .map((tag) => `"${tag}"`)
        .join(', ')} or provide your own]
      - Offer Details: [Specify any discounts, deals, or special offers]
      - Call-to-Action: [Encourage users to take a specific action]
      - Additional Information: [Include any additional details you want to highlight]
    `;

      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a top level sms marketing content creator/copy writer.',
            },
            { role: 'user', content: prompt },
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer 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',
          },
        }
      );

      const generatedDescription = response.data.choices[0].message.content;

      setDefaultValues((prevValues) => ({
        ...prevValues,
        message_body: generatedDescription,
      }));

      console.log('Assistant:', generatedDescription);
    } catch (error) {
      console.error('Error making API request:', error);
    } finally {
      setGpt(false);
    }
  };

  const handleFormSubmit = async () => {
    try {
      await addTemplate(defaultValues);
      enqueueSnackbar('Template added successfully', { variant: 'success' });
      router.push('/dashboard/post');
      setDefaultValues({
        message_body: '',
        status: 'DRAFT',
        tags: ['development'],
        variable: [],
      });
    } catch (error) {
      console.error('Failed to add template:', error.message);
      enqueueSnackbar('Failed to add template', { variant: 'error' });
    }
  };

  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Details
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Title, short description, image...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Details" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <TextField
              id="tn"
              label="Template Name"
              value={defaultValues.name}
              onChange={(e) =>
                setDefaultValues((prevState) => ({ ...prevState, name: e.target.value }))
              }
            />
            <TextField
              id="tb"
              label="Template Body"
              value={defaultValues.message_body}
              multiline
              rows={8}
              onChange={(e) =>
                setDefaultValues((prevState) => ({ ...prevState, message_body: e.target.value }))
              }
            />
            <LoadingButton onClick={() => sendMessage()} variant="" size="large" loading={gpt}>
              {!currentPost ? 'Generate Template Using AI' : 'Your Request is Under Processing'}
            </LoadingButton>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderProperties = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Tags and Variables
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Additional functions and attributes...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Properties" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <Autocomplete
              multiple
              limitTags={2}
              id="multiple-limit-tags"
              options={_tags}
              value={defaultValues.tags}
              onChange={(event, newValue) =>
                setDefaultValues((prevState) => ({ ...prevState, tags: newValue }))
              }
              renderInput={(params) => <TextField {...params} label="User Tags" />}
            />

            <Autocomplete
              multiple
              limitTags={2}
              id="multiple-limit-tags"
              options={_variables}
              value={defaultValues.variable}
              onChange={(event, newValue) =>
                setDefaultValues((prevState) => ({ ...prevState, variable: newValue }))
              }
              renderInput={(params) => <TextField {...params} label="Variables" />}
            />
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderActions = (
    <>
      {mdUp && <Grid md={4} />}
      <Grid xs={12} md={8} sx={{ display: 'flex', alignItems: 'center' }}>
        <FormLabel
          control={<Switch defaultChecked />}
          label="Publish"
          sx={{ flexGrow: 1, pl: 3 }}
        />

        <LoadingButton
          type="submit"
          variant="contained"
          size="large"
          sx={{ ml: 2 }}
          onClick={() => handleFormSubmit()}
        >
          {!currentPost ? 'Create Template' : 'Save Changes'}
        </LoadingButton>
      </Grid>
    </>
  );

  return (
    <div>
      <Grid container spacing={3}>
        {renderProperties}
        {renderDetails}
        {renderActions}
      </Grid>
    </div>
  );
}

PostNewEditForm.propTypes = {
  currentPost: PropTypes.object,
};
