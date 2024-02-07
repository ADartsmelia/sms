import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
// @mui
import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';
//
import { PostItemSkeleton } from './post-skeleton';
import PostItemHorizontal from './post-item-horizontal';

// ----------------------------------------------------------------------

export default function PostListHorizontal({ posts, loading }) {
  console.log(posts);
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const currentPage = parseInt(searchParams.get('page'), 10) || 1; // Get current page from URL, default to 1
  const postsPerPage = 8;
  const pageCount = Math.ceil(posts.length / postsPerPage);

  const handlePageChange = (event, newPage) => {
    searchParams.set('page', newPage);
    navigate(`${location.pathname}?${searchParams.toString()}`);
  };

  // Calculate start and end indices for displaying posts on the current page
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = posts.slice(startIndex, endIndex);

  const renderSkeleton = (
    <>
      {[...Array(16)].map((_, index) => (
        <PostItemSkeleton key={index} variant="horizontal" />
      ))}
    </>
  );

  const renderList = (
    <>
      {posts.slice(11).map((post) => (
        <PostItemHorizontal key={post.id} post={post} />
      ))}
      {currentPosts.map((post) => (
        <PostItemHorizontal key={post.id} post={post} />
      ))}
    </>
  );

  return (
    <>
      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          md: 'repeat(2, 1fr)',
        }}
      >
        {loading ? renderSkeleton : renderList}
      </Box>

      {posts.length > 8 && (
        <Pagination
          count={pageCount}
          page={currentPage}
          onChange={handlePageChange}
          sx={{
            mt: 8,
            [`& .${paginationClasses.ul}`]: {
              justifyContent: 'center',
            },
          }}
        />
      )}
    </>
  );
}

PostListHorizontal.propTypes = {
  loading: PropTypes.bool,
  posts: PropTypes.array,
};
