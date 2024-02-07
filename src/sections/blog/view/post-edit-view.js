import PropTypes from 'prop-types';
// @mui
import Container from '@mui/material/Container';
// routes
// import { paths } from 'src/routes/paths';
// api
import { useGetPost } from 'src/api/blog';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import PostNewEditForm from '../post-new-edit-form';

// ----------------------------------------------------------------------

export default function PostEditView({ title }) {
  const settings = useSettingsContext();

  const { post: currentPost } = useGetPost(`${title}`);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs heading="Edit" />

      <PostNewEditForm currentPost={currentPost} />
    </Container>
  );
}

PostEditView.propTypes = {
  title: PropTypes.string,
};
