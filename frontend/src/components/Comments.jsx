import React, { useEffect,useState } from "react";
import styled from "styled-components";
import Comment from "./Comment";
import { useSelector } from "react-redux";
import axios from "axios";

const Container = styled.div``;

const NewComment = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const Input = styled.input`
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  background-color: transparent;
  outline: none;
  padding: 5px;
  width: 100%;
`;
const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const PaginationButton = styled.button`
  padding: 10px 20px;
  margin: 0 5px;
  background-color: ${({ theme }) => theme.background}; /* Match the background color */
  color: ${({ theme }) => theme.text};
  border: none;
  cursor: pointer;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
const PostButton = styled.button`
  background-color: ${({ theme }) => theme.disabled};
  color: ${({ theme }) => theme.text};
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: not-allowed;
  font-weight: bold;
  margin-left: 10px;

  &:hover {
    background-color: ${({ theme }) => theme.disabled};
  }

  &:enabled {
    background-color:  #333333;
    cursor: pointer;
  }
`;
const Comments = () => {
  const videotitle = useSelector((state) => state.video.currentVideo?.title?.replace(/ /g, '-'));
  const {currentUser}=useSelector((state)=>state.user)
  const [comments, setComments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
 
  const [content, setContent] = useState('');
  const [refresh,setRefresh]=useState(false)

  useEffect(() => {
    const fetchComments = async () => {
      if (!videotitle) {
        console.log("Video title is undefined");
        return;
      }

      try {
        console.log(videotitle);
        const commentRes = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/comments/${videotitle}?page=${currentPage}`, { withCredentials: true });
        console.log(commentRes.data.data.docs);
        setComments(commentRes.data.data.docs)
        setTotalPages(commentRes.data.data.totalPages);
        setRefresh(false)
      } catch (error) {
        console.log("Error while fetching the comments", error);
      }
    };

    fetchComments();
  }, [videotitle,currentPage,refresh]);

    
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  const handleDelete = async (commentId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/v1/comments/c/${commentId}`, { withCredentials: true });
      console.log("Comment deleted");
      setRefresh((prev) => !prev);
    } catch (error) {
      console.error("Error deleting comment:", error.response?.data || error.message);
      alert("Failed to delete the comment. Please try again later.");
    }
  };
  const handleCommentAdd=async()=>{
    try {
      const result=await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/comments/${videotitle}`,{content},{ withCredentials: true })
      console.log(result);
      if(result){
        setContent("")
        setRefresh(true)
      }
    } catch (error) {
      console.log("error while adding comment")
    }


  }
  return (
    <Container>
    <NewComment>
      <Avatar src={currentUser?.avatar} />
      <Input 
          placeholder="Add a comment..." 
          value={content} 
          onChange={(e) => setContent(e.target.value)} 
        />
        <PostButton onClick={handleCommentAdd} disabled={!content}>
          Post
        </PostButton>

    </NewComment>
    
    {comments.map((comment) => (
      <Comment key={comment._id} comment={comment} handleDelete={handleDelete}/>
    ))}
    
    <PaginationContainer>
      <PaginationButton disabled={currentPage === 1} onClick={handlePrevPage}>
        Previous
      </PaginationButton>
      
      {/* {[...Array(totalPages).keys()].map((page) => (
        <PaginationButton key={page+1} onClick={() => handlePageChange(page+1)}>
          {page + 1}
        </PaginationButton>
      ))} */}
      
      <PaginationButton disabled={currentPage === totalPages} onClick={handleNextPage}>
        Next
      </PaginationButton>
    </PaginationContainer>
  </Container>
  );
};

export default Comments;
