import PropTypes from 'prop-types';
import { useState } from 'react';

// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
// components
import { useSnackbar } from 'src/components/snackbar';
import { Autocomplete, TextField } from '@mui/material';
import useTemplates from 'src/customHooks/templates';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import useCampaigns from 'src/customHooks/campaigns';
import { useRouter } from 'src/routes/hooks';

export default function CalendarForm({ onClose }) {
  const { enqueueSnackbar } = useSnackbar();
  const _tags = ['All', 'Development', 'Marketing', 'Tech', 'SuperMarket'];
  const _push_sequence = ['HOURLY', 'DAILY', 'MONTHLY', 'CUSTOM'];
  const _push_method = ['MANUAL', 'SCHEDULED', 'REPETITIVE'];
  const _target_channel = ['SMS', 'EMAIL', 'WHATSAPP', 'MESSENGER'];
  const _status = ['DRAFT', 'ACTIVE'];
  const { data: templates } = useTemplates();

  const _templateOptions = templates ? templates.map((template) => template.template_id) : [];

  const [defaultValues, setDefaultValues] = useState({
    customer_selectors: [],
    push_method: '',
    target_channel: '',
    push_sequence: '',
    run_time: '',
    created_at: '',
    name: '',
    description: '',
    status: '',
    template_id: '',
  });

  const router = useRouter();

  const { addCampaign } = useCampaigns();

  const handleFormSubmit = async () => {
    try {
      await addCampaign(defaultValues);
      enqueueSnackbar('Campaign added successfully', { variant: 'success' });
      setDefaultValues({
        customer_selectors: [],
        push_method: '',
        target_channel: '',
        push_sequence: '',
        run_time: '',
        created_at: '',
        name: '',
        description: '',
        status: '',
        template_id: '',
      });
      onClose();
    } catch (error) {
      console.error('Failed to add campaign:', error.message);
      enqueueSnackbar('Failed to add campaign', { variant: 'error' });
    }
  };

  return (
    <div>
      <Stack spacing={3} sx={{ px: 3 }}>
        <TextField
          id="tn"
          label="Campain Name"
          value={defaultValues.name}
          onChange={(e) =>
            setDefaultValues((prevState) => ({ ...prevState, name: e.target.value }))
          }
        />

        <TextField
          id="tn"
          label="Campain Description"
          value={defaultValues.description}
          onChange={(e) =>
            setDefaultValues((prevState) => ({ ...prevState, description: e.target.value }))
          }
        />

        <Autocomplete
          multiple
          limitTags={2}
          id="multiple-limit-tags"
          options={_tags}
          value={defaultValues.tags}
          onChange={(event, newValue) =>
            setDefaultValues((prevState) => ({ ...prevState, customer_selectors: newValue }))
          }
          renderInput={(params) => <TextField {...params} label="User Tags" />}
        />

        <DateTimePicker
          renderInput={(props) => <TextField {...props} label="Run Time" />}
          value={defaultValues.run_time}
          onChange={(newValue) =>
            setDefaultValues((prevState) => ({ ...prevState, run_time: newValue }))
          }
        />

        <Autocomplete
          disablePortal
          id="push_method"
          options={_push_method}
          renderInput={(params) => <TextField {...params} label="Push Method" />}
          onChange={(e, newValue) =>
            setDefaultValues((prevState) => ({ ...prevState, push_method: newValue }))
          }
        />

        <Autocomplete
          disablePortal
          id="target_channel"
          options={_target_channel}
          renderInput={(params) => <TextField {...params} label="Target Channel" />}
          onChange={(e, newValue) =>
            setDefaultValues((prevState) => ({ ...prevState, target_channel: newValue }))
          }
        />

        <Autocomplete
          disablePortal
          id="push_sequence"
          options={_push_sequence}
          value={defaultValues.push_sequence}
          renderInput={(params) => <TextField {...params} label="Push Sequence" />}
          onChange={(e, newValue) =>
            setDefaultValues((prevState) => ({ ...prevState, push_sequence: newValue }))
          }
        />

        <Autocomplete
          disablePortal
          id="status"
          options={_status}
          renderInput={(params) => <TextField {...params} label="status" />}
          onChange={(e, newValue) =>
            setDefaultValues((prevState) => ({ ...prevState, status: newValue }))
          }
        />

        <Autocomplete
          disablePortal
          id="template_id"
          options={_templateOptions}
          renderInput={(params) => <TextField {...params} label="Template Id" />}
          value={defaultValues.template_id}
          onChange={(e, newValue) =>
            setDefaultValues((prevState) => ({ ...prevState, template_id: newValue }))
          }
        />
      </Stack>

      <DialogActions>
        <Box sx={{ flexGrow: 1 }} />

        <Button variant="outlined" color="inherit" onClick={onClose}>
          Cancel
        </Button>

        <LoadingButton type="submit" variant="contained" onClick={handleFormSubmit}>
          Save Changes
        </LoadingButton>
      </DialogActions>
    </div>
  );
}

CalendarForm.propTypes = {
  onClose: PropTypes.func,
};
