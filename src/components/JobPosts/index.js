import React from 'react';
import Grid from 'react-md/lib/Grids/Grid'
import Cell from 'react-md/lib/Grids/Cell'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo-hooks'
import Post from './Post'
import ProfilePost from './ProfilePost'
import Search from '../Search'
import 'sass/components/jobSearch/index.scss'

const GET_DOGS = gql`
  {
    job {
      id
      name
    }
  }
`;

function JobPosts(props) {
  const { posts, isAdmin } = props
  
  return (
    <div className='jobSearch'>
      <div className='jobSearch_searchKey'>
        <div className='container'>
          <h1 className='jobSearch_searchKey_title'>
            Search {isAdmin ? 'Interns' : 'Internship Jobs' }
          </h1>
          <h5 className='jobSearch_searchKey_subtitle'>
            90 { isAdmin ?  'interns found' : 'intern jobs available' }
          </h5>
        </div>
      </div>
      <div className='jobSearch_contents'>
        <div className='container'>
          <Grid>
            <Cell
              className='jobSearch_search' 
              size={3}>
              <Search />
            </Cell>
            <Cell 
              className='jobSearch_jobs'
              size={9}>
              <Posts posts={posts} postRenderer={isAdmin ? ProfilePost : Post }/>
            </Cell>
          </Grid>
        </div>
      </div>
    </div>
  );
}

export default JobPosts

function Posts(props) {
  const { postRenderer: PostComponent, posts } = props
  const { data, error, loading } = useQuery(GET_DOGS);
  if (loading) {
    return 'Loading'
  }
  if (error) {
    return 'Error'
  }
  return (
    <>
     {data.job.map(post => (
        <PostComponent key={post.id} post={post}/>
      ))}
    </>
  )
}

Post.defaulProps = {
  postRenderer: Post
}
