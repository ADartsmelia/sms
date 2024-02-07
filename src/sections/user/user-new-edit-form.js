import PropTypes from 'prop-types';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import { useRouter } from 'src/routes/hooks';
import { useSnackbar } from 'src/components/snackbar';
import { Autocomplete, Chip, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import useCustomers from 'src/customHooks/customers';

export default function UserNewEditForm({ currentUser }) {
  const router = useRouter();
  const _tags = ['All', 'Development', 'Marketing', 'Tech', 'SuperMarket'];
  const { addCustomer } = useCustomers();

  const [defaultValues, setDefaultValues] = useState({
    name: '',
    lastName: '',
    email: '',
    address: '',
    phone: '',
    isVerified: true,
    tags: [],
  });

  useEffect(() => {
    if (currentUser) {
      setDefaultValues({
        name: currentUser.name || '',
        lastName: currentUser.lastName || '',
        email: currentUser.email || '',
        address: currentUser.address || '',
        phone: currentUser.phone || '',
        isVerified: currentUser.isVerified ?? true,
        tags: currentUser.tags || [],
      });
    }
  }, [currentUser]);

  const { enqueueSnackbar } = useSnackbar();

  // Function to handle form submission
  const handleFormSubmit = async () => {
    try {
      await addCustomer(defaultValues);
      enqueueSnackbar('Customer added successfully', { variant: 'success' });
      setDefaultValues({
        name: '',
        lastName: '',
        email: '',
        address: '',
        phone: '',
        isVerified: true,
        tags: [],
      });
      router.push('/dashboard/user/list'); // Redirect to dashboard/user/list
    } catch (error) {
      enqueueSnackbar('Failed to add customer', { variant: 'error' });
    }
  };

  return (
    <Grid container spacing={3} alignItems="center">
      <Grid xs={12} md={12}>
        <Card sx={{ p: 3 }}>
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
          >
            <TextField
              id="fm"
              label="First Name"
              value={defaultValues.name}
              onChange={(e) =>
                setDefaultValues((prevState) => ({ ...prevState, name: e.target.value }))
              }
            />
            <TextField
              id="lm"
              label="Last Name"
              value={defaultValues.lastName}
              onChange={(e) =>
                setDefaultValues((prevState) => ({ ...prevState, lastName: e.target.value }))
              }
            />
            <TextField
              id="em"
              label="Email"
              value={defaultValues.email}
              onChange={(e) =>
                setDefaultValues((prevState) => ({ ...prevState, email: e.target.value }))
              }
            />
            <TextField
              id="ph"
              label="Phone"
              value={defaultValues.phone}
              onChange={(e) =>
                setDefaultValues((prevState) => ({ ...prevState, phone: e.target.value }))
              }
            />
            <TextField
              id="ad"
              label="Address"
              value={defaultValues.address}
              onChange={(e) =>
                setDefaultValues((prevState) => ({ ...prevState, address: e.target.value }))
              }
            />
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
          </Box>
          <Stack alignItems="flex-end" sx={{ mt: 3 }}>
            <LoadingButton type="submit" variant="contained" onClick={() => handleFormSubmit()}>
              {!currentUser ? 'Create User' : 'Save Changes'}
            </LoadingButton>
          </Stack>
        </Card>
      </Grid>
    </Grid>
  );
}

UserNewEditForm.propTypes = {
  currentUser: PropTypes.object,
};
