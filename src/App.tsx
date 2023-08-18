import { Box } from "@mui/material";
import Container from "@mui/material/Container";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import CircularProgress from '@mui/material/CircularProgress';
import Modal from "@mui/material/Modal";
import JoditEditor from "jodit-react";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";


const config = {
  readonly: false,
  placeholder: "Start typings...",
};
const App = () => {
  const [open, setOpen] = React.useState(false);
  const [response, setResponse] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  const editor = useRef(null);
  const [content, setContent] = useState("");
  console.log(content);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);


  const sendEmail = async(email: any)=>{
    setIsLoading(true)
    try{
        const {data} = await axios.post('https://nodemailer-backend-portfolio.vercel.app/api/v1/mail/send-mail',{
          userEmail: email,
          message:content
        })
        if(data.msg){
          window.location.reload()
          setIsLoading(false)
        }

    }catch(error){
      console.log(error)
    }
  }


  useEffect(() => {
    const fetchAllMails = async () => {
      try {
        const { data } = await axios.get(
          "https://nodemailer-backend-portfolio.vercel.app/api/v1/mail/get-all-mails"
        );
        setResponse(data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllMails();
  }, []);

  return (
    <Box>
      <Container>
        <Box>
          <TableContainer>
            <Table sx={{ minWidth: 250 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="left">Username</TableCell>
                  <TableCell align="left">Email</TableCell>
                  <TableCell align="left">Message</TableCell>
                  <TableCell align="right">Send Message</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {response.map((ele:any) => {
                  return (
                    <>
                      <TableCell align="left">{ele.name}</TableCell>
                      <TableCell align="left">{ele.email}</TableCell>
                      <TableCell align="left">{ele.message}</TableCell>
                      <TableCell align="right">
                        <Button onClick={handleOpen}>Reply</Button>
                      </TableCell>
                      <Modal open={open} onClose={handleClose}>
                        <Stack direction={"column"}>
                          <JoditEditor
                            ref={editor}
                            value={content}   
                            config={config}
                            // tabIndex={1} // tabIndex of textarea
                            onBlur={(newContent) => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
                            
                          />
                          <Stack bgcolor={"white"} direction={"row"}>
                            <Button onClick={()=>sendEmail(ele.email)} disabled={isLoading}>{
                              isLoading?<CircularProgress/>:'Send'
                            }</Button>
                            <Button onClick={handleClose}>Cancel</Button>
                          </Stack>
                        </Stack>
                      </Modal>
                    </>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Container>
    </Box>
  );
};

export default App;
